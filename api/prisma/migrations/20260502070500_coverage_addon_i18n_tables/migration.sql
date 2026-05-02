-- i18n Phase 3: CoveragePackage + AddOn `name_localized Json?` →
-- per-locale rows. Last of the localised fields on the platform after
-- Phase 1 (Car) and Phase 2 (City + PickupLocation).
--
-- Audit confirmed both columns hold proper jsonb objects (not the
-- JSON-string-of-JSON shape that bit Phase 1 with Car.description),
-- so a straight `->> loc.l` extraction works. Still, we defensively
-- handle the JSON-string case via `(col #>> '{}')::jsonb` — adopted
-- as standard pattern after the Phase 1 lesson (see project memory:
-- feedback_jsonb_string_vs_object).
--
-- DATA SAFETY: rows inserted from the existing Json blob BEFORE the
-- column is dropped. Empty strings stored as NULL via NULLIF.
-- Both halves run inside Prisma's implicit migration transaction.

-- ─── 1. CREATE coverage_package_translation ─────────────────────────────
CREATE TABLE coverage_package_translation (
    id                   SERIAL       PRIMARY KEY,
    coverage_package_id  INTEGER      NOT NULL,
    locale               VARCHAR(2)   NOT NULL,
    name                 TEXT         NOT NULL,
    created_at           TIMESTAMP(3) NOT NULL DEFAULT now(),
    updated_at           TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT coverage_package_translation_pkg_id_locale_key
        UNIQUE (coverage_package_id, locale),
    CONSTRAINT coverage_package_translation_pkg_id_fkey
        FOREIGN KEY (coverage_package_id) REFERENCES coverage_package(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX coverage_package_translation_locale_idx ON coverage_package_translation(locale);

-- ─── 2. Backfill coverage_package translations ─────────────────────────
WITH locales(l) AS (VALUES ('uk'), ('ru'), ('en'), ('pl'), ('ro')),
parsed AS (
    SELECT id,
           CASE WHEN jsonb_typeof(name_localized) = 'string'
                THEN (name_localized #>> '{}')::jsonb
                ELSE name_localized
           END AS loc_obj
    FROM coverage_package
    WHERE name_localized IS NOT NULL
)
INSERT INTO coverage_package_translation (coverage_package_id, locale, name)
SELECT p.id, loc.l, NULLIF(p.loc_obj ->> loc.l, '')
FROM parsed p
CROSS JOIN locales loc
WHERE NULLIF(p.loc_obj ->> loc.l, '') IS NOT NULL;

-- ─── 3. Drop CoveragePackage.name_localized ────────────────────────────
ALTER TABLE coverage_package DROP COLUMN name_localized;

-- ─── 4. CREATE add_on_translation ──────────────────────────────────────
CREATE TABLE add_on_translation (
    id          SERIAL       PRIMARY KEY,
    add_on_id   INTEGER      NOT NULL,
    locale      VARCHAR(2)   NOT NULL,
    name        TEXT         NOT NULL,
    created_at  TIMESTAMP(3) NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT add_on_translation_add_on_id_locale_key
        UNIQUE (add_on_id, locale),
    CONSTRAINT add_on_translation_add_on_id_fkey
        FOREIGN KEY (add_on_id) REFERENCES add_on(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX add_on_translation_locale_idx ON add_on_translation(locale);

-- ─── 5. Backfill add_on translations ───────────────────────────────────
WITH locales(l) AS (VALUES ('uk'), ('ru'), ('en'), ('pl'), ('ro')),
parsed AS (
    SELECT id,
           CASE WHEN jsonb_typeof(name_localized) = 'string'
                THEN (name_localized #>> '{}')::jsonb
                ELSE name_localized
           END AS loc_obj
    FROM add_on
    WHERE name_localized IS NOT NULL
)
INSERT INTO add_on_translation (add_on_id, locale, name)
SELECT p.id, loc.l, NULLIF(p.loc_obj ->> loc.l, '')
FROM parsed p
CROSS JOIN locales loc
WHERE NULLIF(p.loc_obj ->> loc.l, '') IS NOT NULL;

-- ─── 6. Drop AddOn.name_localized ──────────────────────────────────────
ALTER TABLE add_on DROP COLUMN name_localized;
