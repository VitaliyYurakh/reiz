-- Split the Car model into three: `car` (core) + `car_damage_fees` + `car_maintenance`.
--
-- WHY: Car had ~58 typed columns + 25 relations. Senior reviewer flagged
-- this as "too many fields on one model — group what's logically separable
-- into 1:1 relations". Damage fees and scheduled-maintenance state are
-- both independent concerns that can each be NULL ("uses platform
-- defaults" / "not yet serviced"), so they extract cleanly.
--
-- DATA SAFETY: this migration is non-destructive for existing rows —
-- column data is copied 1:1 into the new tables BEFORE the old columns
-- are dropped. INSERT … SELECT only inserts a row when at least one
-- value is non-NULL, so cars that never had any damage-fee or
-- maintenance config remain without a child row (modelled as the
-- nullable 1:1 relation in Prisma).
--
-- All four DDL phases (CREATE, INSERT, ALTER DROP) run inside the same
-- implicit Prisma transaction, so a partial failure rolls back cleanly.

-- ─── 1. Create new tables ───────────────────────────────────────────────
CREATE TABLE car_damage_fees (
    id                          SERIAL PRIMARY KEY,
    car_id                      INTEGER NOT NULL UNIQUE,
    damage_tires_fee            DOUBLE PRECISION,
    damage_glass_chip_fee       DOUBLE PRECISION,
    damage_lost_keys_fee        DOUBLE PRECISION,
    damage_broken_glass_fee     DOUBLE PRECISION,
    damage_total_loss_percent   DOUBLE PRECISION,
    damage_scratches_fee        DOUBLE PRECISION,
    damage_smoking_fee          DOUBLE PRECISION,
    deposit_multiplier          DOUBLE PRECISION,
    created_at                  TIMESTAMP(3) NOT NULL DEFAULT now(),
    updated_at                  TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT car_damage_fees_car_id_fkey
        FOREIGN KEY (car_id) REFERENCES car(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE car_maintenance (
    id                          SERIAL PRIMARY KEY,
    car_id                      INTEGER NOT NULL UNIQUE,
    current_odometer            INTEGER,
    service_interval_km         INTEGER,
    next_service_mileage_km     INTEGER,
    last_service_at             TIMESTAMP(3),
    last_service_mileage_km     INTEGER,
    created_at                  TIMESTAMP(3) NOT NULL DEFAULT now(),
    updated_at                  TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT car_maintenance_car_id_fkey
        FOREIGN KEY (car_id) REFERENCES car(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ─── 2. Copy existing data ──────────────────────────────────────────────
-- Only insert a row when at least one source value is non-NULL — keeps
-- the new tables sparse and matches the "optional 1:1" semantics.

INSERT INTO car_damage_fees (
    car_id,
    damage_tires_fee,
    damage_glass_chip_fee,
    damage_lost_keys_fee,
    damage_broken_glass_fee,
    damage_total_loss_percent,
    damage_scratches_fee,
    damage_smoking_fee,
    deposit_multiplier
)
SELECT
    id,
    damage_tires_fee,
    damage_glass_chip_fee,
    damage_lost_keys_fee,
    damage_broken_glass_fee,
    damage_total_loss_percent,
    damage_scratches_fee,
    damage_smoking_fee,
    deposit_multiplier
FROM car
WHERE
    damage_tires_fee          IS NOT NULL
 OR damage_glass_chip_fee     IS NOT NULL
 OR damage_lost_keys_fee      IS NOT NULL
 OR damage_broken_glass_fee   IS NOT NULL
 OR damage_total_loss_percent IS NOT NULL
 OR damage_scratches_fee      IS NOT NULL
 OR damage_smoking_fee        IS NOT NULL
 OR deposit_multiplier        IS NOT NULL;

INSERT INTO car_maintenance (
    car_id,
    current_odometer,
    service_interval_km,
    next_service_mileage_km,
    last_service_at,
    last_service_mileage_km
)
SELECT
    id,
    current_odometer,
    service_interval_km,
    next_service_mileage_km,
    last_service_at,
    last_service_mileage_km
FROM car
WHERE
    current_odometer        IS NOT NULL
 OR service_interval_km     IS NOT NULL
 OR next_service_mileage_km IS NOT NULL
 OR last_service_at         IS NOT NULL
 OR last_service_mileage_km IS NOT NULL;

-- ─── 3. Drop the now-redundant columns from `car` ───────────────────────
ALTER TABLE car
    DROP COLUMN damage_tires_fee,
    DROP COLUMN damage_glass_chip_fee,
    DROP COLUMN damage_lost_keys_fee,
    DROP COLUMN damage_broken_glass_fee,
    DROP COLUMN damage_total_loss_percent,
    DROP COLUMN damage_scratches_fee,
    DROP COLUMN damage_smoking_fee,
    DROP COLUMN deposit_multiplier,
    DROP COLUMN current_odometer,
    DROP COLUMN service_interval_km,
    DROP COLUMN next_service_mileage_km,
    DROP COLUMN last_service_at,
    DROP COLUMN last_service_mileage_km;
