-- Promote service_event.type, inspection.type, fine.type from String
-- to typed Postgres ENUMs. The value sets were already established in
-- the front-end codebase (FINE_TYPE_KEYS in rental-detail-constants.ts,
-- SERVICE_TYPES in admin/service/page.tsx, INSPECTION_TYPE_CLASS for
-- inspection PICKUP/RETURN) — this migration just makes the database
-- enforce them.
--
-- Pre-flight DB audit confirmed all three tables are empty in prod, so
-- no USING cast can fail. Adding default values for the three columns
-- isn't necessary because the schema already requires `type` on each
-- create, and the validators are now `z.nativeEnum(...)`.

CREATE TYPE "ServiceEventType" AS ENUM ('MAINTENANCE', 'REPAIR', 'INSURANCE_RENEWAL', 'INSPECTION_GOV', 'WASH', 'OTHER');
CREATE TYPE "InspectionType"   AS ENUM ('PICKUP', 'RETURN');
CREATE TYPE "FineType"         AS ENUM ('OVERMILEAGE', 'DAMAGE', 'LATE_RETURN', 'FUEL', 'CLEANING', 'TRAFFIC', 'ACCIDENT', 'OTHER');

ALTER TABLE service_event ALTER COLUMN type TYPE "ServiceEventType" USING type::"ServiceEventType";
ALTER TABLE inspection    ALTER COLUMN type TYPE "InspectionType"   USING type::"InspectionType";
ALTER TABLE fine          ALTER COLUMN type TYPE "FineType"         USING type::"FineType";
