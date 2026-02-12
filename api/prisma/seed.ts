import {PrismaClient} from '@prisma/client';
import {seedCities, seedPickupLocations, popularCitySlugs} from './seed-cities';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.upsert({
        where: {email: 'admin@example.com'},
        update: {},
        create: {
            email: 'admin@example.com',
            pass: '0d5ddaeacb40e93eaee8f31a684d2abaa630ed1420164646f8085c2070c73c400ae507c3d773b5904371a99be1af678a50e27fdb2e052cebdcda90bad5785361',
            role: 'admin',
        },
    });

    const segments = await prisma.segment.findMany();

    if (!segments.length) {
        await prisma.segment.createMany({
            data: [
                {
                    name: 'Economy',
                    description: 'Affordable and fuel-efficient vehicles',
                    overmileagePrice: 0.2,
                },
                {
                    name: 'Business',
                    description: 'Comfortable cars for business travel',
                    overmileagePrice: 0.35,
                },
                {
                    name: 'Luxury',
                    description: 'Premium vehicles for VIP experience',
                    overmileagePrice: 0.4,
                },
                {
                    name: 'SUV',
                    description: 'SUV',
                    overmileagePrice: 0.45,
                },
                {
                    name: 'VAN',
                    description: 'VAN',
                    overmileagePrice: 0.5,
                },
            ],
            skipDuplicates: true,
        });
    }

    // CRM: Coverage Packages
    const coverageCount = await prisma.coveragePackage.count();
    if (!coverageCount) {
        await prisma.coveragePackage.createMany({
            data: [
                {
                    name: 'Basic',
                    nameLocalized: {uk: 'З заставою', ru: 'С залогом', en: 'With Deposit'},
                    depositPercent: 100,
                    description: 'Full deposit required',
                },
                {
                    name: 'Medium',
                    nameLocalized: {uk: 'Покриття 50%', ru: 'Покрытие 50%', en: '50% Coverage'},
                    depositPercent: 50,
                    description: 'Half deposit, partial coverage',
                },
                {
                    name: 'Full',
                    nameLocalized: {uk: 'Покриття 100%', ru: 'Покрытие 100%', en: 'Full Coverage'},
                    depositPercent: 0,
                    description: 'No deposit, full insurance coverage',
                },
            ],
        });
    }

    // CRM: Add-Ons
    const addOnCount = await prisma.addOn.count();
    if (!addOnCount) {
        await prisma.addOn.createMany({
            data: [
                {
                    name: 'Additional Driver',
                    nameLocalized: {uk: 'Додатковий водій', ru: 'Дополнительный водитель', en: 'Additional Driver'},
                    pricingMode: 'PER_DAY',
                    unitPriceMinor: 600,
                    currency: 'USD',
                    qtyEditable: true,
                },
                {
                    name: 'Child Seat',
                    nameLocalized: {uk: 'Дитяче автокрісло', ru: 'Детское автокресло', en: 'Child Seat'},
                    pricingMode: 'PER_DAY',
                    unitPriceMinor: 300,
                    currency: 'USD',
                },
                {
                    name: 'Border Crossing',
                    nameLocalized: {uk: 'Виїзд за кордон', ru: 'Выезд за границу', en: 'Border Crossing'},
                    pricingMode: 'ONE_TIME',
                    unitPriceMinor: 15000,
                    currency: 'USD',
                },
                {
                    name: 'Chauffeur',
                    nameLocalized: {uk: 'Послуги водія', ru: 'Услуги водителя', en: 'Chauffeur Service'},
                    pricingMode: 'MANUAL_QTY',
                    unitPriceMinor: 8000,
                    currency: 'USD',
                    defaultQty: 'rental_days',
                    qtyEditable: true,
                },
            ],
        });
    }

    // CRM: Accounts
    const accountCount = await prisma.account.count();
    if (!accountCount) {
        await prisma.account.createMany({
            data: [
                {name: 'Cash UAH', type: 'CASH', currency: 'UAH'},
                {name: 'Cash USD', type: 'CASH', currency: 'USD'},
                {name: 'Cash EUR', type: 'CASH', currency: 'EUR'},
                {name: 'PrivatBank UAH', type: 'BANK_ACCOUNT', currency: 'UAH'},
                {name: 'Terminal', type: 'BANK_CARD', currency: 'UAH'},
            ],
        });
    }

    // CRM: Generate RatePlans from existing RentalTariffs
    const ratePlanCount = await prisma.ratePlan.count();
    if (!ratePlanCount) {
        const tariffs = await prisma.rentalTariff.findMany();
        for (const t of tariffs) {
            const label = t.maxDays === 0 ? `${t.minDays}+ days` : `${t.minDays}-${t.maxDays} days`;
            await prisma.ratePlan.create({
                data: {
                    name: label,
                    carId: t.carId,
                    minDays: t.minDays,
                    maxDays: t.maxDays,
                    dailyPrice: t.dailyPrice * 100,
                    currency: 'USD',
                },
            });
        }
    }

    // CRM: Migrate existing BookingRequests → RentalRequests
    const orphanedBookings = await prisma.bookingRequest.findMany({
        where: {rentalRequest: null},
    });
    if (orphanedBookings.length) {
        console.log(`Migrating ${orphanedBookings.length} BookingRequest(s) to RentalRequests...`);
        const existingCarIds = new Set(
            (await prisma.car.findMany({select: {id: true}})).map((c) => c.id),
        );
        for (const br of orphanedBookings) {
            try {
                const carExists = br.carId != null && existingCarIds.has(br.carId);
                await prisma.rentalRequest.create({
                    data: {
                        source: 'website',
                        status: 'new',
                        bookingRequestId: br.id,
                        carId: carExists ? br.carId : null,
                        firstName: br.firstName,
                        lastName: br.lastName,
                        phone: br.phone,
                        email: br.email,
                        pickupLocation: br.pickupLocation,
                        returnLocation: br.returnLocation,
                        pickupDate: br.startDate,
                        returnDate: br.endDate,
                        flightNumber: br.flightNumber,
                        comment: br.comment,
                        websiteSnapshot: {
                            carDetails: br.carDetails,
                            selectedPlan: br.selectedPlan,
                            selectedExtras: br.selectedExtras,
                            totalDays: br.totalDays,
                            priceBreakdown: br.priceBreakdown,
                        },
                    },
                });
            } catch (e) {
                console.error(`Failed to migrate BookingRequest ${br.id}: ${e.message}`);
            }
        }
        console.log('BookingRequest migration done.');
    }

    // Ensure Additional Driver has qtyEditable=true
    await prisma.addOn.updateMany({
        where: {name: 'Additional Driver'},
        data: {qtyEditable: true},
    });

    // CRM: Notification Templates
    const notifCount = await prisma.notificationTemplate.count();
    if (!notifCount) {
        await prisma.notificationTemplate.createMany({
            data: [
                {code: 'NEW_REQUEST', channel: 'TELEGRAM', bodyTemplate: '🆕 Нова заявка #{{requestId}} від {{clientName}}. Авто: {{carName}}. Дати: {{pickupDate}} — {{returnDate}}'},
                {code: 'REQUEST_APPROVED', channel: 'TELEGRAM', bodyTemplate: '✅ Заявка #{{requestId}} схвалена. Бронювання #{{reservationId}} створено.'},
                {code: 'REQUEST_REJECTED', channel: 'TELEGRAM', bodyTemplate: '❌ Заявка #{{requestId}} відхилена. Причина: {{reason}}'},
                {code: 'PICKUP_TODAY', channel: 'TELEGRAM', bodyTemplate: '🚗 Видача сьогодні: {{carName}} → {{clientName}}, {{pickupLocation}}, {{pickupTime}}'},
                {code: 'RETURN_TODAY', channel: 'TELEGRAM', bodyTemplate: '🔙 Повернення сьогодні: {{carName}} ← {{clientName}}, {{returnLocation}}, {{returnTime}}'},
                {code: 'OVERDUE', channel: 'TELEGRAM', bodyTemplate: '⚠️ Прострочення: {{carName}}, клієнт {{clientName}}, мав повернути {{returnDate}}'},
                {code: 'INSURANCE_EXPIRING', channel: 'TELEGRAM', bodyTemplate: '🔔 Страховка закінчується: {{carName}}, дата: {{expiryDate}}'},
                {code: 'SERVICE_DUE', channel: 'TELEGRAM', bodyTemplate: '🔧 ТО заплановано: {{carName}}, {{serviceType}}, дата: {{serviceDate}}'},
            ],
        });
    }

    // ── Cities & Pickup Locations ──
    const cityCount = await prisma.city.count();
    if (!cityCount) {
        console.log('Seeding cities and pickup locations...');
        for (const cityData of seedCities) {
            const city = await prisma.city.create({
                data: {
                    ...cityData,
                    isPopular: popularCitySlugs.includes(cityData.slug),
                    isActive: true,
                },
            });
            const locations = seedPickupLocations[cityData.slug] || [];
            for (const loc of locations) {
                await prisma.pickupLocation.create({
                    data: {
                        ...loc,
                        cityId: city.id,
                        isActive: true,
                    },
                });
            }
        }
        console.log(`Seeded ${seedCities.length} cities with pickup locations.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
