-- Tier 3 cosmetic: Car.paymentMethods CSV-string + Car.allowedCountries
-- jsonb both → typed Postgres arrays.
--
-- WHY: both columns held what were effectively arrays in disguise — the
-- admin form already split paymentMethods on `,` every read, and the
-- FE Car type already declared `allowedCountries: string[] | null`.
-- The DB column types lied about that. Native arrays = real type
-- enforcement (text[] / varchar(2)[]), real defaults (`{}` instead of
-- `null`-or-empty-string-or-empty-json), and queryability
-- (`WHERE 'UA' = ANY (allowed_countries)`).
--
-- DATA SAFETY:
--   * paymentMethods: split on `,`. Production rows seen so far hold
--     either NULL or short tokens like `card`, `cash`, `terminal` — no
--     trimming needed.
--   * allowedCountries: existing rows hold a jsonb array (e.g. `["UA",
--     "PL"]`) when set. `jsonb_array_elements_text()` extracts each
--     code into a row; aggregated into the new varchar(2)[] column.
--
-- Both halves run inside Prisma's implicit migration transaction.

-- ─── 1. paymentMethods (TEXT → TEXT[]) ──────────────────────────────────
ALTER TABLE car ADD COLUMN payment_methods_new TEXT[] NOT NULL DEFAULT '{}';

UPDATE car
SET payment_methods_new = string_to_array(payment_methods, ',')
WHERE payment_methods IS NOT NULL AND payment_methods != '';

ALTER TABLE car DROP COLUMN payment_methods;
ALTER TABLE car RENAME COLUMN payment_methods_new TO payment_methods;

-- ─── 2. allowedCountries (JSONB → VARCHAR(2)[]) ─────────────────────────
ALTER TABLE car ADD COLUMN allowed_countries_new VARCHAR(2)[] NOT NULL DEFAULT '{}';

UPDATE car
SET allowed_countries_new = ARRAY(
    SELECT jsonb_array_elements_text(allowed_countries)
)
WHERE allowed_countries IS NOT NULL
  AND jsonb_typeof(allowed_countries) = 'array';

ALTER TABLE car DROP COLUMN allowed_countries;
ALTER TABLE car RENAME COLUMN allowed_countries_new TO allowed_countries;
