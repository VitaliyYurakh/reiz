-- Convert 18 monetary Float columns to Int (UAH копійки / minor units).
--
-- WHY: Float (IEEE-754) loses precision on simple decimal arithmetic
-- (`9.99 + 0.01 = 9.999999999999998`). The platform-wide convention is
-- `Int *Minor` (see Transaction.amountMinor, Fine.amountMinor). Mixing
-- Float-UAH and Int-Minor across the same tables makes every callsite
-- a guessing game. This migration removes the Float branch.
--
-- DATA SAFETY: each old Float column is multiplied by 100 with `ROUND`
-- (not truncate — `99.999` → 10000, not 9999) and stored in a new
-- *_minor column. The old column is dropped only AFTER the new one is
-- backfilled. All inside Prisma's implicit transaction.
--
-- Affected:
--   car (11 columns), car_damage_fees (6 columns), segment (1 column).
--
-- NOT migrated (not money — kept as Float):
--   damage_total_loss_percent (percent 0–100)
--   deposit_multiplier        (coefficient like 1.5)
--   day_fx_rate.rate          (FX rate ratio)
--   transaction.fx_rate       (FX rate ratio)

-- ─── helper: convert a nullable Float UAH column to a nullable Int копійки column
-- (drop & recreate idempotently — pattern repeats for each column)

-- ─── 1. car (11 nullable columns) ────────────────────────────────────────
ALTER TABLE car ADD COLUMN overmileage_price_minor              INT;
ALTER TABLE car ADD COLUMN younger_driver_surcharge_minor       INT;
ALTER TABLE car ADD COLUMN late_return_fee_per_hour_minor       INT;
ALTER TABLE car ADD COLUMN unlimited_mileage_price_1day_minor   INT;
ALTER TABLE car ADD COLUMN unlimited_mileage_price_2to7_minor   INT;
ALTER TABLE car ADD COLUMN intercity_delivery_price_minor       INT;
ALTER TABLE car ADD COLUMN car_wash_price_minor                 INT;
ALTER TABLE car ADD COLUMN empty_tank_fee_minor                 INT;
ALTER TABLE car ADD COLUMN additional_driver_fee_minor          INT;
ALTER TABLE car ADD COLUMN equipment_rental_price_minor         INT;
ALTER TABLE car ADD COLUMN after_hours_service_fee_minor        INT;

UPDATE car SET
    overmileage_price_minor              = ROUND(overmileage_price              * 100)::int,
    younger_driver_surcharge_minor       = ROUND(younger_driver_surcharge       * 100)::int,
    late_return_fee_per_hour_minor       = ROUND(late_return_fee_per_hour       * 100)::int,
    unlimited_mileage_price_1day_minor   = ROUND(unlimited_mileage_price_1day   * 100)::int,
    unlimited_mileage_price_2to7_minor   = ROUND(unlimited_mileage_price_2to7   * 100)::int,
    intercity_delivery_price_minor       = ROUND(intercity_delivery_price       * 100)::int,
    car_wash_price_minor                 = ROUND(car_wash_price                 * 100)::int,
    empty_tank_fee_minor                 = ROUND(empty_tank_fee                 * 100)::int,
    additional_driver_fee_minor          = ROUND(additional_driver_fee          * 100)::int,
    equipment_rental_price_minor         = ROUND(equipment_rental_price         * 100)::int,
    after_hours_service_fee_minor        = ROUND(after_hours_service_fee        * 100)::int;

ALTER TABLE car DROP COLUMN overmileage_price;
ALTER TABLE car DROP COLUMN younger_driver_surcharge;
ALTER TABLE car DROP COLUMN late_return_fee_per_hour;
ALTER TABLE car DROP COLUMN unlimited_mileage_price_1day;
ALTER TABLE car DROP COLUMN unlimited_mileage_price_2to7;
ALTER TABLE car DROP COLUMN intercity_delivery_price;
ALTER TABLE car DROP COLUMN car_wash_price;
ALTER TABLE car DROP COLUMN empty_tank_fee;
ALTER TABLE car DROP COLUMN additional_driver_fee;
ALTER TABLE car DROP COLUMN equipment_rental_price;
ALTER TABLE car DROP COLUMN after_hours_service_fee;

-- ─── 2. car_damage_fees (6 nullable columns) ─────────────────────────────
ALTER TABLE car_damage_fees ADD COLUMN damage_tires_fee_minor        INT;
ALTER TABLE car_damage_fees ADD COLUMN damage_glass_chip_fee_minor   INT;
ALTER TABLE car_damage_fees ADD COLUMN damage_lost_keys_fee_minor    INT;
ALTER TABLE car_damage_fees ADD COLUMN damage_broken_glass_fee_minor INT;
ALTER TABLE car_damage_fees ADD COLUMN damage_scratches_fee_minor    INT;
ALTER TABLE car_damage_fees ADD COLUMN damage_smoking_fee_minor      INT;

UPDATE car_damage_fees SET
    damage_tires_fee_minor        = ROUND(damage_tires_fee        * 100)::int,
    damage_glass_chip_fee_minor   = ROUND(damage_glass_chip_fee   * 100)::int,
    damage_lost_keys_fee_minor    = ROUND(damage_lost_keys_fee    * 100)::int,
    damage_broken_glass_fee_minor = ROUND(damage_broken_glass_fee * 100)::int,
    damage_scratches_fee_minor    = ROUND(damage_scratches_fee    * 100)::int,
    damage_smoking_fee_minor      = ROUND(damage_smoking_fee      * 100)::int;

ALTER TABLE car_damage_fees DROP COLUMN damage_tires_fee;
ALTER TABLE car_damage_fees DROP COLUMN damage_glass_chip_fee;
ALTER TABLE car_damage_fees DROP COLUMN damage_lost_keys_fee;
ALTER TABLE car_damage_fees DROP COLUMN damage_broken_glass_fee;
ALTER TABLE car_damage_fees DROP COLUMN damage_scratches_fee;
ALTER TABLE car_damage_fees DROP COLUMN damage_smoking_fee;

-- ─── 3. segment (1 NOT NULL column) ──────────────────────────────────────
-- Segment.overmileagePrice was NOT NULL; the new column must also be
-- NOT NULL. Add as nullable, backfill, set NOT NULL, then drop old.
ALTER TABLE segment ADD COLUMN overmileage_price_minor INT;
UPDATE segment SET overmileage_price_minor = ROUND(overmileage_price * 100)::int;
ALTER TABLE segment ALTER COLUMN overmileage_price_minor SET NOT NULL;
ALTER TABLE segment DROP COLUMN overmileage_price;
