import {Car, CarCountingRule, Prisma, RentalTariff, User} from '@prisma/client';
import {CarNotFoundError, prisma} from '../utils';
import {CreateCarDto, UpdateCarDto, CarPhotoDto, CountingRuleDto, TariffDto} from '../types';
import {Language} from '../types/dto.types';
import {flattenCityTranslations, CITY_TRANSLATIONS_SELECT} from './city.service';

// Five locales the public site renders.  Kept here (not in a shared
// constant) because the i18n table is Car-specific for now; expanding to
// other models will lift this list.
const TRANSLATION_LOCALES = ['uk', 'ru', 'en', 'pl', 'ro'] as const;
type TranslationLocale = (typeof TRANSLATION_LOCALES)[number];

type LocalizedMap = Partial<Record<TranslationLocale, string>>;

type CarTranslationRow = {
    locale: string;
    description: string | null;
    engineType: string | null;
    transmission: string | null;
    driveType: string | null;
};

/**
 * Flatten the per-locale translation rows back into the legacy
 * `{uk: '...', ru: '...', en: '...', pl: '...', ro: '...'}` map shape so
 * existing FE callers (`car.engineType[locale]`, `localized(car.description, locale)`)
 * keep working unchanged after the i18n normalisation. The original
 * `translations` array is preserved on the response in case a client
 * wants to query it directly.
 */
export function flattenCarTranslations<T extends {translations?: CarTranslationRow[] | null}>(
    car: T,
): T & {description: LocalizedMap; engineType: LocalizedMap; transmission: LocalizedMap; driveType: LocalizedMap} {
    const description: LocalizedMap = {};
    const engineType: LocalizedMap = {};
    const transmission: LocalizedMap = {};
    const driveType: LocalizedMap = {};
    for (const tr of car.translations ?? []) {
        const loc = tr.locale as TranslationLocale;
        if (tr.description !== null) description[loc] = tr.description;
        if (tr.engineType !== null) engineType[loc] = tr.engineType;
        if (tr.transmission !== null) transmission[loc] = tr.transmission;
        if (tr.driveType !== null) driveType[loc] = tr.driveType;
    }
    return {...car, description, engineType, transmission, driveType};
}

/**
 * Convert the legacy `{description: {uk,ru,...}, engineType: {...}, ...}`
 * write shape into a list of per-locale upsert operations against the
 * `car_translation` table. Locales that don't appear anywhere are
 * skipped — admins blank a translation by sending `''` (or `null`),
 * which clears that field on the existing row but doesn't delete the row
 * (other locales might still need it).
 *
 * Accepts the legacy admin form which sometimes sent `description` as a
 * plain string (Ukrainian-only fallback) — that lands in the `uk` row.
 */
/**
 * Returns a list of `{locale, fields}` translation upsert specs derived
 * from the legacy write shape. Caller decides whether to run them on a
 * top-level prisma client or a transaction handle (so that the Car row
 * + translation rows update atomically).
 */
function planTranslationUpserts(input: {
    description?: string | LocalizedMap | null;
    engineType?: LocalizedMap | null;
    transmission?: LocalizedMap | null;
    driveType?: LocalizedMap | null;
}): Array<{locale: string; fields: Partial<Pick<CarTranslationRow, 'description' | 'engineType' | 'transmission' | 'driveType'>>}> {
    const byLocale: Record<string, Partial<Pick<CarTranslationRow, 'description' | 'engineType' | 'transmission' | 'driveType'>>> = {};

    const ensure = (locale: string) => {
        if (!byLocale[locale]) byLocale[locale] = {};
        return byLocale[locale];
    };

    if (input.description !== undefined) {
        if (typeof input.description === 'string') {
            // Legacy plain-string form posts: Ukrainian only.
            ensure('uk').description = input.description || null;
        } else if (input.description !== null) {
            for (const [locale, value] of Object.entries(input.description)) {
                ensure(locale).description = (value as string) || null;
            }
        }
    }

    for (const field of ['engineType', 'transmission', 'driveType'] as const) {
        const map = input[field];
        if (map == null) continue;
        for (const [locale, value] of Object.entries(map)) {
            ensure(locale)[field] = (value as string) || null;
        }
    }

    return Object.entries(byLocale).map(([locale, fields]) => ({locale, fields}));
}

const CAR_INCLUDE = {
    carPhoto: true,
    carCountingRule: {orderBy: {depositPercent: 'asc'}},
    rentalTariff: true,
    segment: true,
    damageFees: true,
    maintenance: true,
    translations: true,
    // Catalogue-backed configuration options (M:N). Each row carries
    // the option's translations so we can flatten back to the legacy
    // `[{uk,ru,en,pl,ro}, ...]` array shape on the API response.
    configurationOptions: {
        orderBy: {sortOrder: 'asc'},
        include: {configurationOption: {include: {translations: true}}},
    },
} as const satisfies Prisma.CarInclude;

type ConfigOptionRow = {
    sortOrder: number;
    configurationOption: {
        translations: Array<{locale: string; value: string}>;
    };
};

function flattenConfigurationOptions(options: ConfigOptionRow[] | null | undefined): Array<Record<string, string>> {
    if (!options) return [];
    return options.map((row) => {
        const out: Record<string, string> = {};
        for (const tr of row.configurationOption.translations) {
            out[tr.locale] = tr.value;
        }
        return out;
    });
}

class CarService {
    async getAll(citySlug?: string) {
        const where: any = {};

        if (citySlug) {
            where.cityAvailability = {
                some: {
                    isActive: true,
                    city: {slug: citySlug, isActive: true},
                },
            };
        }

        const cars = await prisma.car.findMany({
            where,
            include: {
                ...CAR_INCLUDE,
                cityAvailability: {
                    where: {isActive: true},
                    include: {
                        city: {select: {id: true, slug: true, translations: CITY_TRANSLATIONS_SELECT}},
                    },
                },
            },
        });
        return cars.map((c) => ({
            ...flattenCarTranslations(c),
            configuration: flattenConfigurationOptions(c.configurationOptions),
            cityAvailability: c.cityAvailability.map((row) => ({...row, city: flattenCityTranslations(row.city)})),
        }));
    }

    async getOne(id: number) {
        const car = await prisma.car.findUnique({
            where: {id},
            include: {
                ...CAR_INCLUDE,
                cityAvailability: {
                    include: {
                        city: {select: {id: true, slug: true, translations: CITY_TRANSLATIONS_SELECT}},
                    },
                },
            },
        });
        if (!car) return null;
        return {
            ...flattenCarTranslations(car),
            configuration: flattenConfigurationOptions(car.configurationOptions),
            cityAvailability: car.cityAvailability.map((row) => ({...row, city: flattenCityTranslations(row.city)})),
        };
    }

    async getCityAvailability(carId: number) {
        const rows = await prisma.carCityAvailability.findMany({
            where: {carId},
            include: {
                city: {select: {id: true, slug: true, isActive: true, translations: CITY_TRANSLATIONS_SELECT}},
            },
        });
        return rows.map((row) => ({...row, city: flattenCityTranslations(row.city)}));
    }

    async updateCityAvailability(carId: number, availability: {cityId: number; deliveryFee: number; minRentalDays: number; isActive: boolean}[]) {
        const car = await prisma.car.findUnique({where: {id: carId}});
        if (!car) throw new CarNotFoundError();

        await prisma.$transaction(
            availability.map((item) =>
                prisma.carCityAvailability.upsert({
                    where: {carId_cityId: {carId, cityId: item.cityId}},
                    create: {carId, cityId: item.cityId, deliveryFee: item.deliveryFee, minRentalDays: item.minRentalDays, isActive: item.isActive},
                    update: {deliveryFee: item.deliveryFee, minRentalDays: item.minRentalDays, isActive: item.isActive},
                })
            )
        );
    }

    async createOne(car: CreateCarDto) {
        const {segmentIds, ...rest} = car;

        // Atomic create: Car + default RentalTariff rows + default CarCountingRule rows.
        // Before the transaction, updateRentalTariff/updateCountingRule were called
        // without await and without transaction — a failure on either left the Car
        // in the DB without pricing data (audit H-3).
        return await prisma.$transaction(async (tx) => {
            const newCar = await tx.car.create({
                data: {
                    ...rest,
                    ...(segmentIds && segmentIds.length > 0 && {
                        segment: {connect: segmentIds.map((sid) => ({id: sid}))},
                    }),
                },
            });

            await tx.rentalTariff.createMany({
                data: [
                    {dailyPriceMinor: 0, depositMinor: 0, minDays: 1, maxDays: 2, carId: newCar.id},
                    {dailyPriceMinor: 0, depositMinor: 0, minDays: 3, maxDays: 7, carId: newCar.id},
                    {dailyPriceMinor: 0, depositMinor: 0, minDays: 8, maxDays: 29, carId: newCar.id},
                    {dailyPriceMinor: 0, depositMinor: 0, minDays: 30, maxDays: 0, carId: newCar.id},
                ],
            });

            await tx.carCountingRule.createMany({
                data: [
                    {pricePercent: 0, depositPercent: 0, carId: newCar.id},
                    {pricePercent: 12, depositPercent: 50, carId: newCar.id},
                    {pricePercent: 36, depositPercent: 100, carId: newCar.id},
                ],
            });

            return newCar;
        });
    }

    async updateOne(id: number, carDto: UpdateCarDto) {
        const car = await prisma.car.findUnique({where: {id}});

        if (!car) {
            throw new CarNotFoundError();
        }

        // Translation fields are persisted to `car_translation` rows (1
        // per locale), not the Car table. `configuration` is no longer
        // a Car column either — it's a M:N link table to the option
        // catalogue. Pull all of these out of the payload.
        const {
            segmentIds,
            description,
            engineType,
            transmission,
            driveType,
            configuration,
            damageFees,
            maintenance,
            ...rest
        } = carDto as UpdateCarDto & {configuration?: Array<Record<string, string>>};
        const data: any = {...rest};

        if (segmentIds) data.segment = {set: segmentIds.map((sid) => ({id: sid}))};

        // 1:1 nested writes — upsert the related row when present, delete it
        // when caller passes `null`, leave untouched when key is omitted.
        if (damageFees !== undefined) {
            data.damageFees = damageFees === null
                ? {delete: true}
                : {upsert: {create: damageFees, update: damageFees}};
        }
        if (maintenance !== undefined) {
            data.maintenance = maintenance === null
                ? {delete: true}
                : {upsert: {create: maintenance, update: maintenance}};
        }

        // Atomic: Car row + per-locale translation upserts in one tx.
        // Without it, a translation upsert failure would leave the Car
        // partially updated (admin edits "Hyundai" → "Toyota" + new
        // engineType, sees Toyota saved but engineType missing).
        return await prisma.$transaction(async (tx) => {
            const updated = await tx.car.update({
                where: {id},
                data: data as Prisma.CarUncheckedUpdateInput,
                include: CAR_INCLUDE,
            });

            const plans = planTranslationUpserts({description, engineType, transmission, driveType});
            for (const {locale, fields} of plans) {
                await tx.carTranslation.upsert({
                    where: {carId_locale: {carId: id, locale}},
                    create: {carId: id, locale, ...fields},
                    update: fields,
                });
            }

            // Configuration: replace-all semantics for now (admin
            // sends the full list every save). For each item:
            //   1. Find or create ConfigurationOption by slug (= lower
            //      uk text). Brand-new options also get translation rows.
            //   2. Re-link this car: drop existing
            //      `car_configuration_option` rows, insert new ones
            //      preserving sort order from the array index.
            if (configuration !== undefined) {
                const items = Array.isArray(configuration) ? configuration : [];
                const links: Array<{configurationOptionId: number; sortOrder: number}> = [];
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const ukRaw = (item.uk ?? '').trim();
                    if (!ukRaw) continue;
                    const slug = ukRaw.toLowerCase();
                    const option = await tx.configurationOption.upsert({
                        where: {slug},
                        create: {
                            slug,
                            translations: {
                                create: (['uk', 'ru', 'en', 'pl', 'ro'] as const)
                                    .map((loc) => ({locale: loc, value: (item[loc] ?? '').trim()}))
                                    .filter((t) => t.value),
                            },
                        },
                        update: {},
                    });
                    links.push({configurationOptionId: option.id, sortOrder: i});
                }
                // Replace links for this car.
                await tx.carConfigurationOption.deleteMany({where: {carId: id}});
                if (links.length) {
                    await tx.carConfigurationOption.createMany({
                        data: links.map((l) => ({carId: id, ...l})),
                    });
                }
            }

            // Re-fetch to pick up any translations that were upserted.
            const fresh = await tx.car.findUnique({where: {id}, include: CAR_INCLUDE});
            if (fresh) {
                return {
                    ...flattenCarTranslations(fresh),
                    configuration: flattenConfigurationOptions(fresh.configurationOptions),
                };
            }
            return flattenCarTranslations(updated);
        });
    }

    async updateRentalTariff(carId: number, tariffs: TariffDto[]) {
        const car = await prisma.car.findUnique({where: {id: carId}});

        if (!car) {
            throw new CarNotFoundError();
        }

        // Atomic upsert of all tariffs using the @@unique([minDays, maxDays, carId])
        // compound key. Before the transaction, the loop could partially succeed —
        // a mid-iteration failure left the car with a mix of old and new prices
        // (audit H-5).
        await prisma.$transaction(
            tariffs.map((tariff) =>
                prisma.rentalTariff.upsert({
                    where: {
                        minDays_maxDays_carId: {
                            minDays: tariff.minDays,
                            maxDays: tariff.maxDays,
                            carId,
                        },
                    },
                    create: {...tariff, carId},
                    update: tariff,
                })
            )
        );
    }

    async addCarPreviewPhoto(carId: number, url: string) {
        const car = await prisma.car.findUnique({where: {id: carId}});

        if (!car) {
            throw new CarNotFoundError();
        }

        await prisma.car.update({
            where: {
                id: carId,
            },
            data: {
                previewUrl: url,
            },
        });

        return url;
    }

    async addCarPhoto(carId: number, carPhoto: CarPhotoDto) {
        const car = await prisma.car.findUnique({where: {id: carId}});

        if (!car) {
            throw new CarNotFoundError();
        }

        await prisma.carPhoto.create({
            data: {
                ...carPhoto,
                carId: car.id,
            },
        });

        return carPhoto.url;
    }

    async updateCountingRule(carId: number, countingRulesDto: CountingRuleDto[]) {
        const car = await prisma.car.findUnique({where: {id: carId}});

        if (!car) {
            throw new CarNotFoundError();
        }

        // Atomic replace: deleteMany + createMany in a single transaction.
        // Before this, a failure between deleteMany and the parallel creates
        // left the car with zero counting rules (audit H-4).
        // CarCountingRule has no business-level unique key, so full-replace is
        // the only correct semantics here — but it MUST be atomic.
        await prisma.$transaction(async (tx) => {
            await tx.carCountingRule.deleteMany({where: {carId}});
            if (countingRulesDto.length > 0) {
                await tx.carCountingRule.createMany({
                    data: countingRulesDto.map((rule) => ({...rule, carId: car.id})),
                });
            }
        });
    }

    async updatePhotoCar(carPhotoId: number, alt: string) {
        await prisma.carPhoto.update({
            where: {id: carPhotoId},
            data: {
                alt,
            },
        });
    }

    async deleteCarPhoto(id: number) {
        await prisma.carPhoto.delete({where: {id}});
    }

    async deleteOne(id: number) {
        await prisma.car.delete({where: {id}});
    }

    /**
     * Hard-block a car from any new rental (separate from `isAvailable` which
     * gates the public catalog). The reason is shown to managers in the rental
     * creation flow when they try to assign this car.
     */
    async block(id: number, reason: string) {
        return await prisma.car.update({
            where: {id},
            data: {isBlocked: true, blockReason: reason},
        });
    }

    async unblock(id: number) {
        return await prisma.car.update({
            where: {id},
            data: {isBlocked: false, blockReason: null},
        });
    }

    /**
     * Update mileage-based maintenance schedule. Auto-derives nextServiceMileageKm
     * from lastServiceMileageKm + serviceIntervalKm if both are present and
     * nextServiceMileageKm is not explicitly provided.
     */
    async updateMaintenance(id: number, data: {
        currentOdometer?: number | null;
        serviceIntervalKm?: number | null;
        nextServiceMileageKm?: number | null;
        lastServiceMileageKm?: number | null;
        lastServiceAt?: string | Date | null;
    }) {
        const car = await prisma.car.findUnique({where: {id}});
        if (!car) throw new CarNotFoundError();

        const payload: any = {};
        for (const k of ['currentOdometer', 'serviceIntervalKm', 'nextServiceMileageKm', 'lastServiceMileageKm'] as const) {
            if (data[k] !== undefined) payload[k] = data[k];
        }
        if (data.lastServiceAt !== undefined) {
            payload.lastServiceAt = data.lastServiceAt ? new Date(data.lastServiceAt as any) : null;
        }

        // Auto-derive next-service mileage when both interval and last-service
        // mileage are known and the caller didn't explicitly set the next one.
        if (
            data.nextServiceMileageKm === undefined &&
            (data.serviceIntervalKm != null || data.lastServiceMileageKm != null)
        ) {
            const existing = await prisma.carMaintenance.findUnique({where: {carId: id}});
            const interval = data.serviceIntervalKm ?? existing?.serviceIntervalKm;
            const lastMileage = data.lastServiceMileageKm ?? existing?.lastServiceMileageKm;
            if (interval != null && lastMileage != null) {
                payload.nextServiceMileageKm = lastMileage + interval;
            }
        }

        return await prisma.carMaintenance.upsert({
            where: {carId: id},
            create: {carId: id, ...payload},
            update: payload,
        });
    }

    /**
     * Cars that are due for service: currentOdometer >= nextServiceMileageKm.
     * Returns only cars with a defined next-service threshold.
     */
    async listDueForService() {
        const rows = await prisma.carMaintenance.findMany({
            where: {
                nextServiceMileageKm: {not: null},
                currentOdometer: {not: null},
            },
            include: {
                car: {select: {id: true, brand: true, model: true, plateNumber: true}},
            },
        });
        return rows
            .filter((m) => m.currentOdometer != null && m.nextServiceMileageKm != null && m.currentOdometer >= m.nextServiceMileageKm)
            .map((m) => ({
                id: m.car.id,
                brand: m.car.brand,
                model: m.car.model,
                plateNumber: m.car.plateNumber,
                currentOdometer: m.currentOdometer,
                nextServiceMileageKm: m.nextServiceMileageKm,
                lastServiceAt: m.lastServiceAt,
                serviceIntervalKm: m.serviceIntervalKm,
                kmOver: (m.currentOdometer ?? 0) - (m.nextServiceMileageKm ?? 0),
            }));
    }

    /**
     * Returns the unique catalogue of configuration options across the
     * fleet. Pre-i18n-Phase-4 this scanned every car's `Json[]` blob
     * and deduped at runtime; now it's a straight SELECT against the
     * `ConfigurationOption` table — same response shape so the admin
     * autocomplete UI stays unchanged.
     */
    async getConfigurationOptions() {
        const opts = await prisma.configurationOption.findMany({
            include: {translations: true},
        });
        const out = opts.map((o) => {
            const map: Record<string, string> = {};
            for (const tr of o.translations) {
                if (tr.value) map[tr.locale] = tr.value;
            }
            return {
                uk: map.uk ?? '',
                ru: map.ru ?? '',
                en: map.en ?? '',
                pl: map.pl ?? '',
            };
        }).filter((m) => m.uk);
        return out.sort((a, b) => a.uk.localeCompare(b.uk, 'uk'));
    }

}

export default new CarService();
