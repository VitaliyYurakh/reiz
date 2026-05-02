-- Normalise Car.configuration (Json[] of `{uk,ru,en,pl,ro}` items) into
-- a proper M:N catalogue. Three new tables:
--   * configuration_option              — one row per unique option
--                                         (deduped by lower-cased uk text)
--   * configuration_option_translation  — per-locale strings
--   * car_configuration_option          — M:N join (carId × optionId)
--
-- WHY: pre-this-commit each car had its own Json[] copy of the option
-- list. "AC" was duplicated across 13 cars × 5 locales = 65 stored
-- strings. No way to query "which cars have ABS" without scanning every
-- car's blob. No catalogue UI possible without writing custom dedup logic
-- (which `getConfigurationOptions()` in car.service did at runtime —
-- now redundant).
--
-- Migration is non-destructive: stages all extracted (car, item) pairs
-- into a temp table, builds the catalogue from distinct uk-keyed items,
-- inserts translations + join rows from the temp data, drops the old
-- column. All inside the implicit migration transaction.

-- ─── 1. CREATE TABLES ──────────────────────────────────────────────────
CREATE TABLE configuration_option (
    id          SERIAL       PRIMARY KEY,
    slug        TEXT         NOT NULL UNIQUE,
    created_at  TIMESTAMP(3) NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP(3) NOT NULL DEFAULT now()
);

CREATE TABLE configuration_option_translation (
    id                       SERIAL       PRIMARY KEY,
    configuration_option_id  INTEGER      NOT NULL,
    locale                   VARCHAR(2)   NOT NULL,
    value                    TEXT         NOT NULL,
    created_at               TIMESTAMP(3) NOT NULL DEFAULT now(),
    updated_at               TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT cot_option_id_locale_key UNIQUE (configuration_option_id, locale),
    CONSTRAINT cot_option_id_fkey
        FOREIGN KEY (configuration_option_id) REFERENCES configuration_option(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX cot_locale_idx ON configuration_option_translation(locale);

CREATE TABLE car_configuration_option (
    car_id                   INTEGER      NOT NULL,
    configuration_option_id  INTEGER      NOT NULL,
    sort_order               INTEGER      NOT NULL DEFAULT 0,
    created_at               TIMESTAMP(3) NOT NULL DEFAULT now(),
    PRIMARY KEY (car_id, configuration_option_id),
    CONSTRAINT cco_car_id_fkey
        FOREIGN KEY (car_id) REFERENCES car(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT cco_option_id_fkey
        FOREIGN KEY (configuration_option_id) REFERENCES configuration_option(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX cco_option_id_idx ON car_configuration_option(configuration_option_id);

-- ─── 2. Extract everything into a temp table ───────────────────────────
-- One row per (car, item-position-in-array). Each row carries the full
-- jsonb item so we can pick out per-locale text without re-walking the
-- source blob.
CREATE TEMP TABLE _stage_config AS
SELECT
    c.id                     AS car_id,
    elem.ord                 AS sort_order,
    LOWER(TRIM(elem.value->>'uk'))  AS slug,
    elem.value               AS item
FROM car c,
     jsonb_array_elements(c.configuration) WITH ORDINALITY AS elem(value, ord)
WHERE c.configuration IS NOT NULL
  AND jsonb_typeof(c.configuration) = 'array'
  AND COALESCE(TRIM(elem.value->>'uk'), '') != '';

-- ─── 3. Insert deduped catalogue rows ─────────────────────────────────
INSERT INTO configuration_option (slug)
SELECT DISTINCT slug FROM _stage_config
ON CONFLICT (slug) DO NOTHING;

-- ─── 4. Insert per-locale translations ────────────────────────────────
-- For each unique slug, walk the 5 locales and emit a row per non-empty
-- value. We rely on the FIRST item we encounter per slug to source the
-- translations — if two cars list "AC" with different en spellings,
-- one wins (the lowest car id row).
INSERT INTO configuration_option_translation (configuration_option_id, locale, value)
SELECT
    o.id,
    loc.l,
    NULLIF(TRIM(s.item->>loc.l), '')
FROM (
    SELECT DISTINCT ON (slug) slug, item
    FROM _stage_config
    ORDER BY slug, car_id ASC
) s
JOIN configuration_option o ON o.slug = s.slug
CROSS JOIN (VALUES ('uk'), ('ru'), ('en'), ('pl'), ('ro')) AS loc(l)
WHERE NULLIF(TRIM(s.item->>loc.l), '') IS NOT NULL
ON CONFLICT (configuration_option_id, locale) DO NOTHING;

-- ─── 5. Insert join rows (preserves per-car sort order) ────────────────
INSERT INTO car_configuration_option (car_id, configuration_option_id, sort_order)
SELECT s.car_id, o.id, MIN(s.sort_order)::int
FROM _stage_config s
JOIN configuration_option o ON o.slug = s.slug
GROUP BY s.car_id, o.id
ON CONFLICT (car_id, configuration_option_id) DO NOTHING;

DROP TABLE _stage_config;

-- ─── 6. Drop the now-redundant Json column ─────────────────────────────
ALTER TABLE car DROP COLUMN configuration;
