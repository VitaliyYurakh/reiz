import {PrismaClient} from '@prisma/client';
import {seedCities, seedPickupLocations, popularCitySlugs} from './seed-cities';
import {ADMIN_PERMISSIONS} from '../app/types/permissions';

const prisma = new PrismaClient();

async function main() {
    // Bootstrap the system Admin role. Idempotent: only created if the
    // role table is empty (post-migration deploys already have it from
    // the SQL migration; this branch only fires on a truly fresh DB).
    const adminRole = await prisma.role.upsert({
        where: {name: 'Admin'},
        update: {permissions: ADMIN_PERMISSIONS}, // keep grants in sync as new modules are added
        create: {
            name: 'Admin',
            description: 'Full access. System role — cannot be deleted.',
            isSystem: true,
            permissions: ADMIN_PERMISSIONS,
        },
    });

    // Bootstrap admin user — only on a fresh DB. `update: {}` is intentionally
    // empty so re-running seed never touches an existing admin's hash or role
    // assignment (audit finding C-2). Password rotation goes through the API.
    //
    // Hash comes from ADMIN_PASSWORD_HASH env (set via GitHub Actions secret
    // → docker-compose). When missing we skip the upsert rather than fall back
    // to a committed hash — keeping bcrypt material out of git history.
    const adminHash = process.env.ADMIN_PASSWORD_HASH;
    if (adminHash) {
        await prisma.user.upsert({
            where: {email: 'admin@example.com'},
            update: {}, // idempotent — never overwrite an existing admin
            create: {
                email: 'admin@example.com',
                passwordHash: adminHash,
                roleId: adminRole.id,
            },
        });
    } else {
        console.log(
            '[seed] ADMIN_PASSWORD_HASH not set — skipping admin upsert. ' +
            'Set the env var to bootstrap admin@example.com on a fresh DB.',
        );
    }

    const segments = await prisma.segment.findMany();

    if (!segments.length) {
        // Per-km cost in копійки (Int *Minor). 0.20 UAH/km → 20.
        await prisma.segment.createMany({
            data: [
                {name: 'Economy',  description: 'Affordable and fuel-efficient vehicles', overmileagePriceMinor: 20},
                {name: 'Business', description: 'Comfortable cars for business travel',   overmileagePriceMinor: 35},
                {name: 'Luxury',   description: 'Premium vehicles for VIP experience',    overmileagePriceMinor: 40},
                {name: 'SUV',      description: 'SUV',                                    overmileagePriceMinor: 45},
                {name: 'VAN',      description: 'VAN',                                    overmileagePriceMinor: 50},
            ],
            skipDuplicates: true,
        });
    }

    // CRM: Coverage Packages. Post-i18n Phase 3: name_localized lives
    // in `coverage_package_translation`. The seed shape stays
    // human-readable; the {uk,ru,en} map is split into nested
    // translations.create per package.
    const coveragePackages = [
        {name: 'Без покриття', depositPercent: 0, description: 'Full refundable deposit required, no insurance coverage', i18n: {uk: 'Без покриття', ru: 'Без покрытия', en: 'No Coverage'}},
        {name: 'Покриття 50%', depositPercent: 50, description: 'Half insurance coverage, reduced deposit', i18n: {uk: 'Покриття 50%', ru: 'Покрытие 50%', en: '50% Coverage'}},
        {name: 'Покриття 100%', depositPercent: 100, description: 'Full insurance coverage, minimal fixed deposit', i18n: {uk: 'Покриття 100%', ru: 'Покрытие 100%', en: 'Full Coverage'}},
    ];
    const coverageCount = await prisma.coveragePackage.count();
    if (!coverageCount) {
        for (const cp of coveragePackages) {
            const {i18n, ...rest} = cp;
            await prisma.coveragePackage.create({
                data: {
                    ...rest,
                    translations: {
                        create: Object.entries(i18n).map(([locale, name]) => ({locale, name})),
                    },
                },
            });
        }
    }

    // CRM: Add-Ons
    const addOns = [
        {name: 'Additional Driver', pricingMode: 'PER_DAY' as const, unitPriceMinor: 600, currency: 'USD' as const, qtyEditable: true,
         i18n: {uk: 'Додатковий водій', ru: 'Дополнительный водитель', en: 'Additional Driver'}},
        {name: 'Child Seat', pricingMode: 'PER_DAY' as const, unitPriceMinor: 300, currency: 'USD' as const,
         i18n: {uk: 'Дитяче автокрісло', ru: 'Детское автокресло', en: 'Child Seat'}},
        {name: 'Border Crossing', pricingMode: 'ONE_TIME' as const, unitPriceMinor: 15000, currency: 'USD' as const,
         i18n: {uk: 'Виїзд за кордон', ru: 'Выезд за границу', en: 'Border Crossing'}},
        {name: 'Chauffeur', pricingMode: 'MANUAL_QTY' as const, unitPriceMinor: 8000, currency: 'USD' as const, defaultQty: 'rental_days', qtyEditable: true,
         i18n: {uk: 'Послуги водія', ru: 'Услуги водителя', en: 'Chauffeur Service'}},
    ];
    const addOnCount = await prisma.addOn.count();
    if (!addOnCount) {
        for (const a of addOns) {
            const {i18n, ...rest} = a;
            await prisma.addOn.create({
                data: {
                    ...rest,
                    translations: {
                        create: Object.entries(i18n).map(([locale, name]) => ({locale, name})),
                    },
                },
            });
        }
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

    // CRM: Generate RatePlans from existing RentalTariffs. Both
    // `tariff.dailyPriceMinor` and `ratePlan.dailyPriceMinor` are stored in
    // копійки after the Phase B money migration — direct copy, no *100.
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
                    dailyPriceMinor: t.dailyPriceMinor,
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
            // Post-i18n Phase 2: name fields live on `city_translation`.
            // The seed-cities dataset still ships the legacy
            // {nameUk, nameRu, nameEn, ...} shape — split it into nested
            // `translations.create` here so the seed file itself stays
            // small and database-shape-agnostic.
            const {nameUk, nameRu, nameEn, nameLocativeUk, nameLocativeRu, nameLocativeEn, ...cityRest} = cityData;
            const city = await prisma.city.create({
                data: {
                    ...cityRest,
                    isPopular: popularCitySlugs.includes(cityData.slug),
                    isActive: true,
                    translations: {
                        create: [
                            {locale: 'uk', name: nameUk, nameLocative: nameLocativeUk},
                            {locale: 'ru', name: nameRu, nameLocative: nameLocativeRu},
                            {locale: 'en', name: nameEn, nameLocative: nameLocativeEn},
                        ],
                    },
                },
            });
            const locations = seedPickupLocations[cityData.slug] || [];
            for (const loc of locations) {
                const {nameUk: lUk, nameRu: lRu, nameEn: lEn, ...locRest} = loc;
                await prisma.pickupLocation.create({
                    data: {
                        ...locRest,
                        cityId: city.id,
                        isActive: true,
                        translations: {
                            create: [
                                {locale: 'uk', name: lUk},
                                {locale: 'ru', name: lRu},
                                {locale: 'en', name: lEn},
                            ],
                        },
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
