// Translation-table flatten helpers shared by services that include
// AddOn / CoveragePackage relations. Pre-Phase 3 those models had a
// `nameLocalized Json?` field shaped `{uk, ru, en}`. After Phase 3
// the values live in `add_on_translation` / `coverage_package_translation`.
//
// FE consumers (BookingCard, BookingModal, etc.) still read
// `addon.nameLocalized?.[locale]` — keeping that contract working is
// cheaper than refactoring every read site. These helpers convert the
// translation rows back into the legacy map.

type TranslationRow = {locale: string; name: string};

export type LegacyLocalizedMap = Record<string, string>;

/**
 * Convert a `translations` array into the legacy `nameLocalized` Json
 * map shape. Returns `null` if there are no rows so the field stays
 * truthy-checkable in the same way the original Json column was.
 */
export function translationsToMap(rows: TranslationRow[] | null | undefined): LegacyLocalizedMap | null {
    if (!rows || rows.length === 0) return null;
    const out: LegacyLocalizedMap = {};
    for (const r of rows) {
        if (r.name) out[r.locale] = r.name;
    }
    return Object.keys(out).length ? out : null;
}

/**
 * Map every `addOn` (or similar `{translations}` shape) inside a
 * deeply-nested response to also include a flat `nameLocalized` field.
 * Keeps the original `translations` array on the object — clients that
 * want to read translations directly still can.
 */
export function flattenLocalizedName<T extends {translations?: TranslationRow[] | null}>(
    obj: T,
): T & {nameLocalized: LegacyLocalizedMap | null} {
    return {...obj, nameLocalized: translationsToMap(obj.translations)};
}

// Standard Prisma include shape for addOn/coveragePackage translations.
export const ADDON_TRANSLATIONS_SELECT = {
    select: {locale: true, name: true},
} as const;

export const COVERAGE_TRANSLATIONS_SELECT = {
    select: {locale: true, name: true},
} as const;
