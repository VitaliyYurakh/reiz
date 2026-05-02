-- i18n Phase 2: pull City + PickupLocation localised fields out of
-- their parent tables into normalised translation tables. One row
-- per (parentId, locale) — same shape as the Phase 1 CarTranslation.
--
-- Pre-migration:
--   city: nameUk, nameRu, nameEn, nameLocativeUk, nameLocativeRu,
--         nameLocativeEn  (6 columns; 3 locales hard-coded)
--   pickup_location: nameUk, nameRu, nameEn  (3 columns; 3 locales)
--
-- Post-migration: city_translation + pickup_location_translation,
-- one row per locale. Adding pl/ro for cities (currently missing
-- entirely from the schema even though the public site supports
-- both) is now an INSERT instead of a column-add migration.
--
-- DATA SAFETY: rows are inserted from each row's existing columns
-- BEFORE the columns are dropped. Both halves run inside Prisma's
-- implicit migration transaction.

-- ─── 1. CREATE city_translation ─────────────────────────────────────────
CREATE TABLE city_translation (
    id            SERIAL       PRIMARY KEY,
    city_id       INTEGER      NOT NULL,
    locale        VARCHAR(2)   NOT NULL,
    name          TEXT         NOT NULL,
    name_locative TEXT         NOT NULL,
    created_at    TIMESTAMP(3) NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT city_translation_city_id_locale_key UNIQUE (city_id, locale),
    CONSTRAINT city_translation_city_id_fkey
        FOREIGN KEY (city_id) REFERENCES city(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX city_translation_locale_idx ON city_translation(locale);

-- ─── 2. Backfill city translations (3 rows per existing city) ───────────
-- All existing rows have non-null values for every column-per-locale
-- (NOT NULL on the old schema), so a straight UNION ALL is safe.
INSERT INTO city_translation (city_id, locale, name, name_locative)
SELECT id, 'uk', name_uk, name_locative_uk FROM city
UNION ALL
SELECT id, 'ru', name_ru, name_locative_ru FROM city
UNION ALL
SELECT id, 'en', name_en, name_locative_en FROM city;

-- ─── 3. Drop the city column-per-locale columns ────────────────────────
ALTER TABLE city DROP COLUMN name_uk;
ALTER TABLE city DROP COLUMN name_ru;
ALTER TABLE city DROP COLUMN name_en;
ALTER TABLE city DROP COLUMN name_locative_uk;
ALTER TABLE city DROP COLUMN name_locative_ru;
ALTER TABLE city DROP COLUMN name_locative_en;

-- ─── 4. CREATE pickup_location_translation ─────────────────────────────
CREATE TABLE pickup_location_translation (
    id                   SERIAL       PRIMARY KEY,
    pickup_location_id   INTEGER      NOT NULL,
    locale               VARCHAR(2)   NOT NULL,
    name                 TEXT         NOT NULL,
    created_at           TIMESTAMP(3) NOT NULL DEFAULT now(),
    updated_at           TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT pickup_location_translation_pickup_id_locale_key UNIQUE (pickup_location_id, locale),
    CONSTRAINT pickup_location_translation_pickup_id_fkey
        FOREIGN KEY (pickup_location_id) REFERENCES pickup_location(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX pickup_location_translation_locale_idx ON pickup_location_translation(locale);

-- ─── 5. Backfill pickup_location translations ──────────────────────────
INSERT INTO pickup_location_translation (pickup_location_id, locale, name)
SELECT id, 'uk', name_uk FROM pickup_location
UNION ALL
SELECT id, 'ru', name_ru FROM pickup_location
UNION ALL
SELECT id, 'en', name_en FROM pickup_location;

-- ─── 6. Drop the pickup_location column-per-locale columns ─────────────
ALTER TABLE pickup_location DROP COLUMN name_uk;
ALTER TABLE pickup_location DROP COLUMN name_ru;
ALTER TABLE pickup_location DROP COLUMN name_en;
