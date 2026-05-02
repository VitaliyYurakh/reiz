-- Move Car's localized text content (description + 3 spec strings) from
-- 4 separate `Json` blob columns into a normalised `car_translation`
-- table. One row per (car_id, locale).
--
-- WHY: each `Json` column was a `{uk,ru,en,pl,ro}` map. Adding a 6th
-- locale required editing every car row; querying "give me the English
-- description" needed `description ->> 'en'` with no proper index;
-- the JSON shape was a runtime contract the DB couldn't enforce. After
-- this migration locales are first-class: a row exists per (car, locale),
-- adding a locale is a backfill, and the unique constraint catches dupes.
--
-- DATA SAFETY: rows are inserted from each existing JSON map *before*
-- the columns are dropped. `?? loc.l` extracts the value at that locale
-- key; rows with no values for a given locale are skipped via the WHERE.
-- All four DDL phases run inside Prisma's implicit transaction — partial
-- failure rolls back cleanly. (`configuration` is left as Json — it's a
-- variable-length array each item with its own multilang map; normalising
-- it requires a separate ConfigurationOption catalogue, out of scope.)

-- ─── 1. CREATE TABLE car_translation ────────────────────────────────────
CREATE TABLE car_translation (
    id            SERIAL       PRIMARY KEY,
    car_id        INTEGER      NOT NULL,
    locale        VARCHAR(2)   NOT NULL,
    description   TEXT,
    engine_type   TEXT,
    transmission  TEXT,
    drive_type    TEXT,
    created_at    TIMESTAMP(3) NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT car_translation_car_id_locale_key UNIQUE (car_id, locale),
    CONSTRAINT car_translation_car_id_fkey
        FOREIGN KEY (car_id) REFERENCES car(id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX car_translation_locale_idx ON car_translation(locale);

-- ─── 2. Backfill from existing Json columns ─────────────────────────────
-- Cross-join each car with the 5 supported locales and emit one row per
-- (car, locale) pair where at least one of the four fields had a value
-- under that key. `->>` returns NULL for missing keys, so the WHERE
-- clause naturally skips empty triples.
WITH locales(l) AS (
    VALUES ('uk'), ('ru'), ('en'), ('pl'), ('ro')
)
INSERT INTO car_translation (car_id, locale, description, engine_type, transmission, drive_type)
SELECT
    c.id,
    loc.l,
    NULLIF(c.description  ->> loc.l, ''),
    NULLIF(c.engine_type  ->> loc.l, ''),
    NULLIF(c.transmission ->> loc.l, ''),
    NULLIF(c.drive_type   ->> loc.l, '')
FROM car c
CROSS JOIN locales loc
WHERE
    NULLIF(c.description  ->> loc.l, '') IS NOT NULL
 OR NULLIF(c.engine_type  ->> loc.l, '') IS NOT NULL
 OR NULLIF(c.transmission ->> loc.l, '') IS NOT NULL
 OR NULLIF(c.drive_type   ->> loc.l, '') IS NOT NULL;

-- ─── 3. Drop the now-redundant Json columns ─────────────────────────────
ALTER TABLE car DROP COLUMN description;
ALTER TABLE car DROP COLUMN engine_type;
ALTER TABLE car DROP COLUMN transmission;
ALTER TABLE car DROP COLUMN drive_type;
