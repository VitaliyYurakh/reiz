import {PrismaClient} from '@prisma/client';
import {hash} from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding test booking history data...');

    // ���─ 1. Find existing car (must have at least one in DB) ──
    const cars = await prisma.car.findMany({take: 3, orderBy: {id: 'asc'}});
    if (!cars.length) {
        console.error('No cars found in DB. Add at least one car first.');
        process.exit(1);
    }

    const coveragePackages = await prisma.coveragePackage.findMany();
    const addOns = await prisma.addOn.findMany();
    const accounts = await prisma.account.findMany({take: 1});
    const adminUser = await prisma.user.findFirst({where: {role: 'admin'}});

    if (!coveragePackages.length || !accounts.length) {
        console.error('Run main seed first: npx prisma db seed');
        process.exit(1);
    }

    // ── 2. Create test client ──
    const testEmail = 'test@reiz.com';
    let client = await prisma.client.findFirst({where: {email: testEmail}});

    if (!client) {
        client = await prisma.client.create({
            data: {
                firstName: 'Тестовий',
                lastName: 'Клієнт',
                phone: '+380991234567',
                email: testEmail,
                country: 'UA',
                city: 'Київ',
                drivingSince: 2016,
                driverLicenseNo: 'АЕК 123456',
                driverLicenseExpiry: new Date('2028-12-31'),
                source: 'seed',
            },
        });
        console.log(`Created test client: ${client.firstName} ${client.lastName} (id: ${client.id})`);
    } else {
        console.log(`Test client already exists (id: ${client.id})`);
    }

    // ── 3. Create customer account ──
    let account = await prisma.customerAccount.findFirst({where: {clientId: client.id}});
    if (!account) {
        const passwordHash = await hash('test123', 12);
        account = await prisma.customerAccount.create({
            data: {
                email: testEmail,
                passwordHash,
                clientId: client.id,
                emailVerified: new Date(),
                isActive: true,
            },
        });
        console.log(`Created customer account: ${testEmail} / test123`);
    } else {
        console.log(`Customer account already exists`);
    }

    const car1 = cars[0];
    const car2 = cars[1] || cars[0];
    const car3 = cars[2] || cars[0];
    const cashAccount = accounts[0];
    const basicCoverage = coveragePackages.find((c) => c.name === 'Basic') || coveragePackages[0];
    const fullCoverage = coveragePackages.find((c) => c.name === 'Full') || coveragePackages[0];

    // ── 4. Completed rental #1 — with fines and add-ons ──
    const res1 = await prisma.reservation.create({
        data: {
            status: 'confirmed',
            clientId: client.id,
            carId: car1.id,
            coveragePackageId: basicCoverage.id,
            pickupLocation: 'Аеропорт Бориспіль',
            returnLocation: 'Київ центр',
            pickupDate: new Date('2025-11-10'),
            returnDate: new Date('2025-11-17'),
            priceSnapshot: {
                dailyRateMinor: 4500,
                days: 7,
                totalMinor: 31500,
                depositAmountMinor: 50000,
                currency: 'USD',
            },
        },
    });

    const rental1 = await prisma.rental.create({
        data: {
            status: 'completed',
            reservationId: res1.id,
            clientId: client.id,
            carId: car1.id,
            contractNumber: 'REIZ-2025-001',
            pickupDate: res1.pickupDate,
            returnDate: res1.returnDate,
            actualReturnDate: new Date('2025-11-18T14:00:00Z'),
            pickupLocation: res1.pickupLocation,
            returnLocation: res1.returnLocation,
            pickupOdometer: 45000,
            returnOdometer: 46200,
            allowedMileage: 1050,
            priceSnapshot: res1.priceSnapshot!,
            depositAmount: 50000,
            depositCurrency: 'USD',
            depositReturned: true,
        },
    });

    // Add-ons for rental 1
    if (addOns.length >= 2) {
        await prisma.reservationAddOn.create({
            data: {
                reservationId: res1.id,
                addOnId: addOns[0].id, // Additional Driver
                quantity: 1,
                unitPriceMinor: 600,
                currency: 'USD',
                totalMinor: 4200, // 7 days * 600
            },
        });
        await prisma.rentalAddOn.create({
            data: {
                rentalId: rental1.id,
                addOnId: addOns[0].id,
                quantity: 1,
                unitPriceMinor: 600,
                currency: 'USD',
                totalMinor: 4200,
            },
        });
        await prisma.reservationAddOn.create({
            data: {
                reservationId: res1.id,
                addOnId: addOns[1].id, // Child Seat
                quantity: 1,
                unitPriceMinor: 300,
                currency: 'USD',
                totalMinor: 2100,
            },
        });
        await prisma.rentalAddOn.create({
            data: {
                rentalId: rental1.id,
                addOnId: addOns[1].id,
                quantity: 1,
                unitPriceMinor: 300,
                currency: 'USD',
                totalMinor: 2100,
            },
        });
    }

    // Late return fine (1 day late)
    const fine1 = await prisma.fine.create({
        data: {
            rentalId: rental1.id,
            type: 'LATE_RETURN',
            description: 'Прострочене повернення на 1 дн.',
            amountMinor: 4500,
            currency: 'USD',
            isPaid: true,
        },
    });

    // Overmileage fine
    await prisma.fine.create({
        data: {
            rentalId: rental1.id,
            type: 'OVERMILEAGE',
            description: 'Перевищення пробігу на 150 км',
            amountMinor: 3000,
            currency: 'USD',
            isPaid: false,
        },
    });

    // Transactions for rental 1
    await prisma.transaction.create({
        data: {
            type: 'PAYMENT',
            accountId: cashAccount.id,
            direction: 'in',
            amountMinor: 31500,
            currency: 'USD',
            fxRate: 41.5,
            amountUahMinor: 1307250,
            description: 'Оплата оренди',
            clientId: client.id,
            rentalId: rental1.id,
            reservationId: res1.id,
            createdByUserId: adminUser?.id,
        },
    });
    await prisma.transaction.create({
        data: {
            type: 'DEPOSIT_RECEIVED',
            accountId: cashAccount.id,
            direction: 'in',
            amountMinor: 50000,
            currency: 'USD',
            fxRate: 41.5,
            amountUahMinor: 2075000,
            description: 'Депозит отримано',
            clientId: client.id,
            rentalId: rental1.id,
        },
    });
    await prisma.transaction.create({
        data: {
            type: 'REFUND',
            accountId: cashAccount.id,
            direction: 'out',
            amountMinor: 50000,
            currency: 'USD',
            fxRate: 41.5,
            amountUahMinor: 2075000,
            description: 'Депозит повернено',
            clientId: client.id,
            rentalId: rental1.id,
        },
    });
    await prisma.transaction.create({
        data: {
            type: 'FINE_PAYMENT',
            accountId: cashAccount.id,
            direction: 'in',
            amountMinor: 4500,
            currency: 'USD',
            fxRate: 41.5,
            amountUahMinor: 186750,
            description: 'Оплата штрафу за прострочення',
            clientId: client.id,
            rentalId: rental1.id,
            fineId: fine1.id,
        },
    });

    console.log(`Created completed rental #1: ${car1.brand} ${car1.model} (with fines + add-ons)`);

    // ── 5. Completed rental #2 — simple, no fines ──
    const res2 = await prisma.reservation.create({
        data: {
            status: 'confirmed',
            clientId: client.id,
            carId: car2.id,
            coveragePackageId: fullCoverage.id,
            pickupLocation: 'Одеса центр',
            returnLocation: 'Одеса центр',
            pickupDate: new Date('2025-12-20'),
            returnDate: new Date('2025-12-25'),
            priceSnapshot: {
                dailyRateMinor: 6000,
                days: 5,
                totalMinor: 30000,
                depositAmountMinor: 0,
                currency: 'USD',
            },
        },
    });

    await prisma.rental.create({
        data: {
            status: 'completed',
            reservationId: res2.id,
            clientId: client.id,
            carId: car2.id,
            contractNumber: 'REIZ-2025-002',
            pickupDate: res2.pickupDate,
            returnDate: res2.returnDate,
            actualReturnDate: new Date('2025-12-25T10:00:00Z'),
            pickupLocation: res2.pickupLocation,
            returnLocation: res2.returnLocation,
            pickupOdometer: 12000,
            returnOdometer: 12450,
            allowedMileage: 750,
            priceSnapshot: res2.priceSnapshot!,
            depositAmount: 0,
            depositCurrency: 'USD',
            depositReturned: false,
        },
    });

    await prisma.transaction.create({
        data: {
            type: 'PAYMENT',
            accountId: cashAccount.id,
            direction: 'in',
            amountMinor: 30000,
            currency: 'USD',
            fxRate: 41.5,
            amountUahMinor: 1245000,
            description: 'Оплата оренди',
            clientId: client.id,
            reservationId: res2.id,
        },
    });

    console.log(`Created completed rental #2: ${car2.brand} ${car2.model} (clean, no fines)`);

    // ── 6. Cancelled reservation ──
    await prisma.reservation.create({
        data: {
            status: 'cancelled',
            clientId: client.id,
            carId: car3.id,
            pickupLocation: 'Львів центр',
            returnLocation: 'Львів центр',
            pickupDate: new Date('2026-01-15'),
            returnDate: new Date('2026-01-20'),
            priceSnapshot: {
                dailyRateMinor: 3500,
                days: 5,
                totalMinor: 17500,
                currency: 'USD',
            },
            cancelReason: 'Змінились плани',
            cancelledAt: new Date('2026-01-10'),
        },
    });

    console.log(`Created cancelled reservation: ${car3.brand} ${car3.model}`);

    // ── 7. Active rental (current) ──
    const res4 = await prisma.reservation.create({
        data: {
            status: 'picked_up',
            clientId: client.id,
            carId: car1.id,
            coveragePackageId: fullCoverage.id,
            pickupLocation: 'Київ центр',
            returnLocation: 'Аеропорт Бориспіль',
            pickupDate: new Date('2026-04-03'),
            returnDate: new Date('2026-04-10'),
            priceSnapshot: {
                dailyRateMinor: 4500,
                days: 7,
                totalMinor: 31500,
                depositAmountMinor: 0,
                currency: 'USD',
            },
        },
    });

    await prisma.rental.create({
        data: {
            status: 'active',
            reservationId: res4.id,
            clientId: client.id,
            carId: car1.id,
            contractNumber: 'REIZ-2026-003',
            pickupDate: res4.pickupDate,
            returnDate: res4.returnDate,
            pickupLocation: res4.pickupLocation,
            returnLocation: res4.returnLocation,
            pickupOdometer: 47500,
            priceSnapshot: res4.priceSnapshot!,
            depositAmount: 0,
            depositCurrency: 'USD',
        },
    });

    // Extension for active rental
    const activeRental = await prisma.rental.findFirst({where: {contractNumber: 'REIZ-2026-003'}});
    if (activeRental) {
        await prisma.rentalExtension.create({
            data: {
                rentalId: activeRental.id,
                oldReturnDate: new Date('2026-04-08'),
                newReturnDate: new Date('2026-04-10'),
                extraDays: 2,
                dailyRateMinor: 4500,
                currency: 'USD',
                totalMinor: 9000,
                reason: 'Клієнт попросив продовжити',
            },
        });
    }

    await prisma.transaction.create({
        data: {
            type: 'PAYMENT',
            accountId: cashAccount.id,
            direction: 'in',
            amountMinor: 31500,
            currency: 'USD',
            fxRate: 41.5,
            amountUahMinor: 1307250,
            description: 'Оплата оренди',
            clientId: client.id,
            reservationId: res4.id,
        },
    });

    console.log(`Created active rental: ${car1.brand} ${car1.model}`);

    // ── 8. Upcoming confirmed reservation ──
    await prisma.reservation.create({
        data: {
            status: 'confirmed',
            clientId: client.id,
            carId: car2.id,
            coveragePackageId: basicCoverage.id,
            pickupLocation: 'Харків центр',
            returnLocation: 'Харків центр',
            pickupDate: new Date('2026-05-01'),
            returnDate: new Date('2026-05-05'),
            priceSnapshot: {
                dailyRateMinor: 6000,
                days: 4,
                totalMinor: 24000,
                depositAmountMinor: 24000,
                currency: 'USD',
            },
        },
    });

    console.log(`Created upcoming reservation: ${car2.brand} ${car2.model}`);

    // ── 9. Update client loyalty stats ──
    await prisma.client.update({
        where: {id: client.id},
        data: {
            totalCompletedRentals: 2,
            totalSpentMinor: 66000, // 31500 + 4500 (fine) + 30000
        },
    });

    console.log('\n✅ Seed complete!');
    console.log(`\nLogin: ${testEmail} / test123`);
    console.log(`\nData created:`);
    console.log(`  - 2 completed rentals (1 with fines + add-ons, 1 clean)`);
    console.log(`  - 1 cancelled reservation`);
    console.log(`  - 1 active rental (with extension)`);
    console.log(`  - 1 upcoming reservation`);
    console.log(`  - Loyalty stats: 2 completed, $660 spent`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
