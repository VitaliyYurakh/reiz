-- Money Phase B: convert remaining Int-UAH-whole-units columns to
-- Int-копійки (minor units). Phase A (commit a1a21bd) already moved the
-- 18 Float monetary fields. This commit finishes the job — afterwards
-- every monetary column on the platform is `Int *Minor`.
--
-- WHY: Phase A left the platform with two storage conventions for
-- money — `*Minor` (Transaction, Fine, ServiceEvent + the renamed Float
-- group) AND plain `Int` storing UAH whole units (RentalTariff,
-- CarCountingRule, the Car delivery/cleaning fees, RatePlan). Devs had
-- to remember which convention applied to which column. This commit
-- removes that ambiguity.
--
-- DATA SAFETY: each old column is multiplied by 100 (whole-UAH → копійки)
-- and stored in a new *_minor column. Old column dropped only after
-- backfill. All inside Prisma's implicit transaction.
--
-- Affected:
--   car: delivery_price, free_delivery_threshold, cleaning_fee,
--        cross_border_fee, cross_border_daily_fee   (5 nullable cols)
--   rental_tariff: deposit, daily_price             (2 NOT NULL cols)
--   car_counting_rule: price_fixed, price_fixed_30, deposit_fixed (3 nullable)
--   rate_plan: daily_price                          (1 NOT NULL col — already
--              stored in копійки per seed.ts, just renamed for clarity)

-- ─── 1. car (5 nullable) ─────────────────────────────────────────────────
ALTER TABLE car ADD COLUMN delivery_price_minor              INT;
ALTER TABLE car ADD COLUMN free_delivery_threshold_minor     INT;
ALTER TABLE car ADD COLUMN cleaning_fee_minor                INT;
ALTER TABLE car ADD COLUMN cross_border_fee_minor            INT;
ALTER TABLE car ADD COLUMN cross_border_daily_fee_minor      INT;

UPDATE car SET
    delivery_price_minor          = delivery_price          * 100,
    free_delivery_threshold_minor = free_delivery_threshold * 100,
    cleaning_fee_minor            = cleaning_fee            * 100,
    cross_border_fee_minor        = cross_border_fee        * 100,
    cross_border_daily_fee_minor  = cross_border_daily_fee  * 100;

ALTER TABLE car DROP COLUMN delivery_price;
ALTER TABLE car DROP COLUMN free_delivery_threshold;
ALTER TABLE car DROP COLUMN cleaning_fee;
ALTER TABLE car DROP COLUMN cross_border_fee;
ALTER TABLE car DROP COLUMN cross_border_daily_fee;

-- ─── 2. rental_tariff (2 NOT NULL) ──────────────────────────────────────
-- NOT NULL columns: ADD nullable → backfill → SET NOT NULL → drop old.
ALTER TABLE rental_tariff ADD COLUMN deposit_minor      INT;
ALTER TABLE rental_tariff ADD COLUMN daily_price_minor  INT;

UPDATE rental_tariff SET
    deposit_minor     = deposit     * 100,
    daily_price_minor = daily_price * 100;

ALTER TABLE rental_tariff ALTER COLUMN deposit_minor     SET NOT NULL;
ALTER TABLE rental_tariff ALTER COLUMN daily_price_minor SET NOT NULL;
ALTER TABLE rental_tariff DROP COLUMN deposit;
ALTER TABLE rental_tariff DROP COLUMN daily_price;

-- ─── 3. car_counting_rule (3 nullable) ──────────────────────────────────
ALTER TABLE car_counting_rule ADD COLUMN price_fixed_minor      INT;
ALTER TABLE car_counting_rule ADD COLUMN price_fixed_30_minor   INT;
ALTER TABLE car_counting_rule ADD COLUMN deposit_fixed_minor    INT;

UPDATE car_counting_rule SET
    price_fixed_minor    = price_fixed    * 100,
    price_fixed_30_minor = price_fixed_30 * 100,
    deposit_fixed_minor  = deposit_fixed  * 100;

ALTER TABLE car_counting_rule DROP COLUMN price_fixed;
ALTER TABLE car_counting_rule DROP COLUMN price_fixed_30;
ALTER TABLE car_counting_rule DROP COLUMN deposit_fixed;

-- ─── 4. rate_plan (1 NOT NULL — already in копійки, rename only) ────────
-- The seed wrote `tariff.daily_price * 100` into rate_plan.daily_price,
-- so the values are already in копійки. We rename for naming consistency
-- but DO NOT multiply again (would 100× the prices on prod).
ALTER TABLE rate_plan RENAME COLUMN daily_price TO daily_price_minor;
