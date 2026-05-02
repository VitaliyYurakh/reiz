import {prisma} from '../utils';

// ─── i18n helpers ────────────────────────────────────────────────────────
// Pre-Phase-2 the City + PickupLocation tables had column-per-locale
// (`name_uk`, `name_ru`, `name_en` …). After Phase 2 those columns are
// rows in `city_translation` / `pickup_location_translation`. To keep
// every existing FE caller working (`city.nameUk`, `loc.nameRu`, …)
// without a parallel front-end refactor, the service layer flattens
// translation rows back into the legacy column-shape on the response.
//
// Adding a 6th locale is now a backfill; FE keeps reading the 3 legacy
// fields it knows about. When admin wires up pl/ro names later we can
// extend the flattened shape (or move FE to read translations directly).

type CityTranslationRow = {locale: string; name: string; nameLocative: string};
type PickupTranslationRow = {locale: string; name: string};

const pickByLocale = <T extends {locale: string}>(rows: T[] | null | undefined, locale: string): T | undefined =>
    (rows ?? []).find((t) => t.locale === locale);

export function flattenCityTranslations<T extends {translations?: CityTranslationRow[] | null}>(
    city: T,
): T & {nameUk: string; nameRu: string; nameEn: string; nameLocativeUk: string; nameLocativeRu: string; nameLocativeEn: string} {
    const uk = pickByLocale(city.translations, 'uk');
    const ru = pickByLocale(city.translations, 'ru');
    const en = pickByLocale(city.translations, 'en');
    return {
        ...city,
        nameUk: uk?.name ?? en?.name ?? '',
        nameRu: ru?.name ?? en?.name ?? '',
        nameEn: en?.name ?? uk?.name ?? '',
        nameLocativeUk: uk?.nameLocative ?? '',
        nameLocativeRu: ru?.nameLocative ?? '',
        nameLocativeEn: en?.nameLocative ?? '',
    };
}

export function flattenPickupTranslations<T extends {translations?: PickupTranslationRow[] | null}>(
    loc: T,
): T & {nameUk: string; nameRu: string; nameEn: string} {
    const uk = pickByLocale(loc.translations, 'uk');
    const ru = pickByLocale(loc.translations, 'ru');
    const en = pickByLocale(loc.translations, 'en');
    return {
        ...loc,
        nameUk: uk?.name ?? en?.name ?? '',
        nameRu: ru?.name ?? en?.name ?? '',
        nameEn: en?.name ?? uk?.name ?? '',
    };
}

// Standard include shapes — kept here so other services (car, inventory)
// can reuse them without recomputing the translations selector.
export const CITY_TRANSLATIONS_SELECT = {
    select: {locale: true, name: true, nameLocative: true},
} as const;

export const PICKUP_TRANSLATIONS_SELECT = {
    select: {locale: true, name: true},
} as const;

// ─── service ─────────────────────────────────────────────────────────────

class CityService {
    async getAll({page = 1, limit = 50, search}: {page?: number; limit?: number; search?: string}) {
        const where: any = {};

        if (search) {
            // Search now goes through translations (nested), since the
            // legacy nameUk/Ru/En columns no longer exist on `city`.
            where.OR = [
                {translations: {some: {name: {contains: search, mode: 'insensitive'}}}},
                {slug: {contains: search, mode: 'insensitive'}},
                {region: {contains: search, mode: 'insensitive'}},
            ];
        }

        const [cities, total] = await Promise.all([
            prisma.city.findMany({
                where,
                include: {
                    translations: CITY_TRANSLATIONS_SELECT,
                    _count: {select: {pickupLocations: true}},
                },
                orderBy: {sortOrder: 'asc'},
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.city.count({where}),
        ]);

        return {cities: cities.map(flattenCityTranslations), total, page, limit, pages: Math.ceil(total / limit)};
    }

    async getOne(id: number) {
        const city = await prisma.city.findUnique({
            where: {id},
            include: {
                translations: CITY_TRANSLATIONS_SELECT,
                pickupLocations: {
                    orderBy: {sortOrder: 'asc'},
                    include: {translations: PICKUP_TRANSLATIONS_SELECT},
                },
            },
        });
        if (!city) return null;
        return {
            ...flattenCityTranslations(city),
            pickupLocations: city.pickupLocations.map(flattenPickupTranslations),
        };
    }

    async getBySlug(slug: string) {
        const city = await prisma.city.findUnique({
            where: {slug},
            include: {
                translations: CITY_TRANSLATIONS_SELECT,
                pickupLocations: {
                    orderBy: {sortOrder: 'asc'},
                    include: {translations: PICKUP_TRANSLATIONS_SELECT},
                },
            },
        });
        if (!city) return null;
        return {
            ...flattenCityTranslations(city),
            pickupLocations: city.pickupLocations.map(flattenPickupTranslations),
        };
    }

    async create(data: {
        slug: string;
        nameUk: string;
        nameRu: string;
        nameEn: string;
        nameLocativeUk: string;
        nameLocativeRu: string;
        nameLocativeEn: string;
        latitude: string;
        longitude: string;
        postalCode: string;
        region: string;
        sortOrder?: number;
        isPopular?: boolean;
        isActive?: boolean;
    }) {
        // Accept the legacy flat shape from the admin form, route name
        // fields into translation rows.
        const {nameUk, nameRu, nameEn, nameLocativeUk, nameLocativeRu, nameLocativeEn, ...rest} = data;
        const created = await prisma.city.create({
            data: {
                ...rest,
                translations: {
                    create: [
                        {locale: 'uk', name: nameUk, nameLocative: nameLocativeUk},
                        {locale: 'ru', name: nameRu, nameLocative: nameLocativeRu},
                        {locale: 'en', name: nameEn, nameLocative: nameLocativeEn},
                    ],
                },
            },
            include: {translations: CITY_TRANSLATIONS_SELECT},
        });
        return flattenCityTranslations(created);
    }

    async update(id: number, data: any) {
        // Same pattern: split the flat shape, upsert translation rows
        // in the same transaction as the City row update.
        const {nameUk, nameRu, nameEn, nameLocativeUk, nameLocativeRu, nameLocativeEn, ...rest} = data;
        const localeUpdates: Array<{locale: 'uk' | 'ru' | 'en'; name?: string; nameLocative?: string}> = [];
        if (nameUk !== undefined || nameLocativeUk !== undefined) localeUpdates.push({locale: 'uk', name: nameUk, nameLocative: nameLocativeUk});
        if (nameRu !== undefined || nameLocativeRu !== undefined) localeUpdates.push({locale: 'ru', name: nameRu, nameLocative: nameLocativeRu});
        if (nameEn !== undefined || nameLocativeEn !== undefined) localeUpdates.push({locale: 'en', name: nameEn, nameLocative: nameLocativeEn});

        return await prisma.$transaction(async (tx) => {
            const updated = await tx.city.update({where: {id}, data: rest});
            for (const u of localeUpdates) {
                await tx.cityTranslation.upsert({
                    where: {cityId_locale: {cityId: id, locale: u.locale}},
                    create: {
                        cityId: id,
                        locale: u.locale,
                        name: u.name ?? '',
                        nameLocative: u.nameLocative ?? '',
                    },
                    update: {
                        ...(u.name !== undefined && {name: u.name}),
                        ...(u.nameLocative !== undefined && {nameLocative: u.nameLocative}),
                    },
                });
            }
            const fresh = await tx.city.findUnique({
                where: {id},
                include: {translations: CITY_TRANSLATIONS_SELECT},
            });
            return fresh ? flattenCityTranslations(fresh) : flattenCityTranslations(updated as any);
        });
    }

    async delete(id: number) {
        return prisma.city.delete({where: {id}});
    }

    // ── Pickup Locations ──

    async getLocations(cityId: number) {
        const locations = await prisma.pickupLocation.findMany({
            where: {cityId},
            include: {translations: PICKUP_TRANSLATIONS_SELECT},
            orderBy: {sortOrder: 'asc'},
        });
        return locations.map(flattenPickupTranslations);
    }

    async createLocation(cityId: number, data: {
        slug: string;
        nameUk: string;
        nameRu: string;
        nameEn: string;
        type: string;
        sortOrder?: number;
        isActive?: boolean;
    }) {
        const {nameUk, nameRu, nameEn, ...rest} = data;
        const created = await prisma.pickupLocation.create({
            data: {
                ...rest,
                cityId,
                translations: {
                    create: [
                        {locale: 'uk', name: nameUk},
                        {locale: 'ru', name: nameRu},
                        {locale: 'en', name: nameEn},
                    ],
                },
            },
            include: {translations: PICKUP_TRANSLATIONS_SELECT},
        });
        return flattenPickupTranslations(created);
    }

    async updateLocation(cityId: number, locId: number, data: any) {
        const {nameUk, nameRu, nameEn, ...rest} = data;
        const localeUpdates: Array<{locale: 'uk' | 'ru' | 'en'; name: string}> = [];
        if (nameUk !== undefined) localeUpdates.push({locale: 'uk', name: nameUk});
        if (nameRu !== undefined) localeUpdates.push({locale: 'ru', name: nameRu});
        if (nameEn !== undefined) localeUpdates.push({locale: 'en', name: nameEn});

        return await prisma.$transaction(async (tx) => {
            const updated = await tx.pickupLocation.update({
                where: {id: locId, cityId},
                data: rest,
            });
            for (const u of localeUpdates) {
                await tx.pickupLocationTranslation.upsert({
                    where: {pickupLocationId_locale: {pickupLocationId: locId, locale: u.locale}},
                    create: {pickupLocationId: locId, locale: u.locale, name: u.name},
                    update: {name: u.name},
                });
            }
            const fresh = await tx.pickupLocation.findUnique({
                where: {id: locId},
                include: {translations: PICKUP_TRANSLATIONS_SELECT},
            });
            return fresh ? flattenPickupTranslations(fresh) : flattenPickupTranslations(updated as any);
        });
    }

    async deleteLocation(cityId: number, locId: number) {
        return prisma.pickupLocation.delete({
            where: {id: locId, cityId},
        });
    }

    // ── Public (no auth) ──

    async getAllPublic() {
        const cities = await prisma.city.findMany({
            where: {isActive: true},
            include: {
                translations: CITY_TRANSLATIONS_SELECT,
                pickupLocations: {
                    where: {isActive: true},
                    orderBy: {sortOrder: 'asc'},
                    include: {translations: PICKUP_TRANSLATIONS_SELECT},
                },
            },
            orderBy: {sortOrder: 'asc'},
        });
        return cities.map((c) => ({
            ...flattenCityTranslations(c),
            pickupLocations: c.pickupLocations.map(flattenPickupTranslations),
        }));
    }
}

export default new CityService();
