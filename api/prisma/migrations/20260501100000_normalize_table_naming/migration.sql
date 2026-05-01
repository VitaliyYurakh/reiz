-- Normalize naming: rename PascalCase legacy tables to snake_case so the
-- whole schema follows one convention (the rest of the project — client,
-- rental, partner, etc. — is already snake_case via @@map). All renames
-- are pure ALTER TABLE … RENAME, atomic, zero data loss. FK constraint
-- names retain their old form (e.g. "Car_partner_id_fkey") — Postgres
-- doesn't require constraint names to match new table names, so leaving
-- them as-is avoids a churny rename of every constraint.
--
-- Scope:
--   * 10 table renames (User, Car, Segment, RentalTariff, CarCountingRule,
--     CarPhoto, BookingRequest, ContactRequest, CallbackRequest,
--     BusinessRequest)
--   * 2 column renames: User.pass → user.password_hash, Car.VIN → car.vin
--
-- The implicit M:N join table "_CarToSegment" stays as-is — Prisma names
-- implicit join tables after the model names (Car, Segment), not the
-- @@map'd table names, so renaming the underlying tables doesn't affect
-- it.

-- ─── Tables ───────────────────────────────────────────────────────────────

ALTER TABLE "User"            RENAME TO "user";
ALTER TABLE "Car"             RENAME TO car;
ALTER TABLE "Segment"         RENAME TO segment;
ALTER TABLE "RentalTariff"    RENAME TO rental_tariff;
ALTER TABLE "CarCountingRule" RENAME TO car_counting_rule;
ALTER TABLE "CarPhoto"        RENAME TO car_photo;
ALTER TABLE "BookingRequest"  RENAME TO booking_request;
ALTER TABLE "ContactRequest"  RENAME TO contact_request;
ALTER TABLE "CallbackRequest" RENAME TO callback_request;
ALTER TABLE "BusinessRequest" RENAME TO business_request;

-- ─── Columns ──────────────────────────────────────────────────────────────

-- User.pass holds a bcrypt hash; rename to make that obvious in the DB.
ALTER TABLE "user" RENAME COLUMN pass TO password_hash;

-- Car.VIN is the only PascalCase-ish column on the table; align with the
-- rest (plate_number, year_of_manufacture, …).
ALTER TABLE car RENAME COLUMN "VIN" TO vin;
