-- CHECK constraints — defence-in-depth invariants the application
-- already assumes. Without these, a buggy admin endpoint or a manual
-- SQL session can silently insert -100 копійки into a price column,
-- 250 years into a driver-age field, or 700° latitude into a city.
-- The constraint catches it at the DB layer with a clean error
-- instead of letting bad data fester.
--
-- Prisma's schema.prisma can't express CHECK constraints natively
-- (they're a SQL-level thing), so this migration is hand-written.
-- Each constraint is named so a violation surfaces a readable error
-- back to the caller, not a Postgres-internal "constraint X violated".

-- ─── Money: every *_minor column must be non-negative ──────────────────
ALTER TABLE car ADD CONSTRAINT car_overmileage_price_minor_nonneg              CHECK (overmileage_price_minor              IS NULL OR overmileage_price_minor              >= 0);
ALTER TABLE car ADD CONSTRAINT car_younger_driver_surcharge_minor_nonneg       CHECK (younger_driver_surcharge_minor       IS NULL OR younger_driver_surcharge_minor       >= 0);
ALTER TABLE car ADD CONSTRAINT car_late_return_fee_per_hour_minor_nonneg       CHECK (late_return_fee_per_hour_minor       IS NULL OR late_return_fee_per_hour_minor       >= 0);
ALTER TABLE car ADD CONSTRAINT car_unlimited_mileage_price_1day_minor_nonneg   CHECK (unlimited_mileage_price_1day_minor   IS NULL OR unlimited_mileage_price_1day_minor   >= 0);
ALTER TABLE car ADD CONSTRAINT car_unlimited_mileage_price_2to7_minor_nonneg   CHECK (unlimited_mileage_price_2to7_minor   IS NULL OR unlimited_mileage_price_2to7_minor   >= 0);
ALTER TABLE car ADD CONSTRAINT car_intercity_delivery_price_minor_nonneg       CHECK (intercity_delivery_price_minor       IS NULL OR intercity_delivery_price_minor       >= 0);
ALTER TABLE car ADD CONSTRAINT car_car_wash_price_minor_nonneg                 CHECK (car_wash_price_minor                 IS NULL OR car_wash_price_minor                 >= 0);
ALTER TABLE car ADD CONSTRAINT car_empty_tank_fee_minor_nonneg                 CHECK (empty_tank_fee_minor                 IS NULL OR empty_tank_fee_minor                 >= 0);
ALTER TABLE car ADD CONSTRAINT car_additional_driver_fee_minor_nonneg          CHECK (additional_driver_fee_minor          IS NULL OR additional_driver_fee_minor          >= 0);
ALTER TABLE car ADD CONSTRAINT car_equipment_rental_price_minor_nonneg         CHECK (equipment_rental_price_minor         IS NULL OR equipment_rental_price_minor         >= 0);
ALTER TABLE car ADD CONSTRAINT car_after_hours_service_fee_minor_nonneg        CHECK (after_hours_service_fee_minor        IS NULL OR after_hours_service_fee_minor        >= 0);
ALTER TABLE car ADD CONSTRAINT car_delivery_price_minor_nonneg                 CHECK (delivery_price_minor                 IS NULL OR delivery_price_minor                 >= 0);
ALTER TABLE car ADD CONSTRAINT car_free_delivery_threshold_minor_nonneg        CHECK (free_delivery_threshold_minor        IS NULL OR free_delivery_threshold_minor        >= 0);
ALTER TABLE car ADD CONSTRAINT car_cleaning_fee_minor_nonneg                   CHECK (cleaning_fee_minor                   IS NULL OR cleaning_fee_minor                   >= 0);
ALTER TABLE car ADD CONSTRAINT car_cross_border_fee_minor_nonneg               CHECK (cross_border_fee_minor               IS NULL OR cross_border_fee_minor               >= 0);
ALTER TABLE car ADD CONSTRAINT car_cross_border_daily_fee_minor_nonneg         CHECK (cross_border_daily_fee_minor         IS NULL OR cross_border_daily_fee_minor         >= 0);

ALTER TABLE rental_tariff      ADD CONSTRAINT rental_tariff_deposit_minor_nonneg     CHECK (deposit_minor     >= 0);
ALTER TABLE rental_tariff      ADD CONSTRAINT rental_tariff_daily_price_minor_nonneg CHECK (daily_price_minor >= 0);
ALTER TABLE rental_tariff      ADD CONSTRAINT rental_tariff_min_max_days_sane        CHECK (min_days >= 0 AND max_days >= 0 AND (max_days = 0 OR max_days >= min_days));

ALTER TABLE car_counting_rule  ADD CONSTRAINT ccr_price_fixed_minor_nonneg          CHECK (price_fixed_minor          IS NULL OR price_fixed_minor          >= 0);
ALTER TABLE car_counting_rule  ADD CONSTRAINT ccr_price_fixed_30_minor_nonneg       CHECK (price_fixed_30_minor       IS NULL OR price_fixed_30_minor       >= 0);
ALTER TABLE car_counting_rule  ADD CONSTRAINT ccr_deposit_fixed_minor_nonneg        CHECK (deposit_fixed_minor        IS NULL OR deposit_fixed_minor        >= 0);
ALTER TABLE car_counting_rule  ADD CONSTRAINT ccr_price_percent_in_range            CHECK (price_percent BETWEEN 0 AND 100);
ALTER TABLE car_counting_rule  ADD CONSTRAINT ccr_deposit_percent_in_range          CHECK (deposit_percent BETWEEN 0 AND 100);

ALTER TABLE rate_plan          ADD CONSTRAINT rate_plan_daily_price_minor_nonneg    CHECK (daily_price_minor >= 0);

ALTER TABLE segment            ADD CONSTRAINT segment_overmileage_price_minor_nonneg CHECK (overmileage_price_minor >= 0);

ALTER TABLE car_damage_fees    ADD CONSTRAINT cdf_damage_tires_fee_minor_nonneg     CHECK (damage_tires_fee_minor       IS NULL OR damage_tires_fee_minor       >= 0);
ALTER TABLE car_damage_fees    ADD CONSTRAINT cdf_damage_glass_chip_fee_minor_nonneg CHECK (damage_glass_chip_fee_minor  IS NULL OR damage_glass_chip_fee_minor  >= 0);
ALTER TABLE car_damage_fees    ADD CONSTRAINT cdf_damage_lost_keys_fee_minor_nonneg CHECK (damage_lost_keys_fee_minor   IS NULL OR damage_lost_keys_fee_minor   >= 0);
ALTER TABLE car_damage_fees    ADD CONSTRAINT cdf_damage_broken_glass_fee_minor_nonneg CHECK (damage_broken_glass_fee_minor IS NULL OR damage_broken_glass_fee_minor >= 0);
ALTER TABLE car_damage_fees    ADD CONSTRAINT cdf_damage_scratches_fee_minor_nonneg CHECK (damage_scratches_fee_minor   IS NULL OR damage_scratches_fee_minor   >= 0);
ALTER TABLE car_damage_fees    ADD CONSTRAINT cdf_damage_smoking_fee_minor_nonneg   CHECK (damage_smoking_fee_minor     IS NULL OR damage_smoking_fee_minor     >= 0);
ALTER TABLE car_damage_fees    ADD CONSTRAINT cdf_damage_total_loss_percent_pct      CHECK (damage_total_loss_percent IS NULL OR damage_total_loss_percent BETWEEN 0 AND 100);
ALTER TABLE car_damage_fees    ADD CONSTRAINT cdf_deposit_multiplier_positive       CHECK (deposit_multiplier IS NULL OR deposit_multiplier > 0);

-- ─── Money: amount_minor (Transaction, Fine, etc.) ─────────────────────
-- Some can legitimately be negative (refunds via direction='out' should
-- still hold the gross amount as positive — direction is a separate
-- column — so we constrain >=0).
ALTER TABLE transaction        ADD CONSTRAINT transaction_amount_minor_nonneg     CHECK (amount_minor >= 0);
ALTER TABLE transaction        ADD CONSTRAINT transaction_amount_uah_minor_nonneg CHECK (amount_uah_minor >= 0);
ALTER TABLE fine               ADD CONSTRAINT fine_amount_minor_nonneg            CHECK (amount_minor >= 0);
ALTER TABLE rental_deposit     ADD CONSTRAINT rental_deposit_amount_minor_nonneg  CHECK (amount_minor >= 0);
ALTER TABLE partner_payment    ADD CONSTRAINT partner_payment_amount_eur_minor_nonneg CHECK (amount_eur_minor >= 0);
ALTER TABLE inventory_item     ADD CONSTRAINT inventory_purchase_price_minor_nonneg CHECK (purchase_price_minor IS NULL OR purchase_price_minor >= 0);
-- ServiceEvent has cost_minor (unit_price_minor lives on add-on lines, see below).
ALTER TABLE service_event      ADD CONSTRAINT service_event_cost_minor_nonneg      CHECK (cost_minor       IS NULL OR cost_minor       >= 0);
ALTER TABLE reservation_add_on ADD CONSTRAINT reservation_add_on_unit_price_minor_nonneg CHECK (unit_price_minor >= 0);
ALTER TABLE reservation_add_on ADD CONSTRAINT reservation_add_on_total_minor_nonneg      CHECK (total_minor      >= 0);
ALTER TABLE rental_add_on      ADD CONSTRAINT rental_add_on_unit_price_minor_nonneg      CHECK (unit_price_minor >= 0);
ALTER TABLE rental_add_on      ADD CONSTRAINT rental_add_on_total_minor_nonneg           CHECK (total_minor      >= 0);

-- ─── Driver ages — physical reality 16..99 ─────────────────────────────
ALTER TABLE car ADD CONSTRAINT car_driver_age_human         CHECK (driver_age IS NULL OR driver_age BETWEEN 16 AND 99);
ALTER TABLE car ADD CONSTRAINT car_younger_driver_age_human CHECK (younger_driver_age IS NULL OR younger_driver_age BETWEEN 16 AND 99);
ALTER TABLE car ADD CONSTRAINT car_driver_experience_human  CHECK (driver_experience IS NULL OR driver_experience BETWEEN 0 AND 80);
ALTER TABLE segment ADD CONSTRAINT segment_driver_age_human CHECK (driver_age BETWEEN 16 AND 99);

-- ─── City coordinates — Earth has only so much surface ─────────────────
ALTER TABLE city ADD CONSTRAINT city_latitude_in_range  CHECK (latitude  BETWEEN -90  AND 90);
ALTER TABLE city ADD CONSTRAINT city_longitude_in_range CHECK (longitude BETWEEN -180 AND 180);

-- ─── Year of manufacture — a car older than 1900 is not a rental ───────
ALTER TABLE car ADD CONSTRAINT car_year_of_manufacture_sane
    CHECK (year_of_manufacture IS NULL OR year_of_manufacture BETWEEN 1900 AND 2100);

-- ─── Mileage limits ────────────────────────────────────────────────────
ALTER TABLE car ADD CONSTRAINT car_daily_mileage_limit_nonneg   CHECK (daily_mileage_limit   IS NULL OR daily_mileage_limit   >= 0);
ALTER TABLE car ADD CONSTRAINT car_weekly_mileage_limit_nonneg  CHECK (weekly_mileage_limit  IS NULL OR weekly_mileage_limit  >= 0);
ALTER TABLE car ADD CONSTRAINT car_monthly_mileage_limit_nonneg CHECK (monthly_mileage_limit IS NULL OR monthly_mileage_limit >= 0);
