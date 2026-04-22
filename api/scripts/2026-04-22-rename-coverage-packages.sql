-- Rename coverage packages to match the real semantic of depositPercent
-- (which is the coverage level, not deposit %).
-- Safe to re-run — UPDATEs are idempotent, INSERT uses ON CONFLICT guard via WHERE NOT EXISTS.

BEGIN;

-- 0% coverage → "Без покриття"
UPDATE "CoveragePackage"
SET name = 'Без покриття'
WHERE "depositPercent" = 0 AND "deletedAt" IS NULL;

-- 100% coverage → "Покриття 100%"
UPDATE "CoveragePackage"
SET name = 'Покриття 100%'
WHERE "depositPercent" = 100 AND "deletedAt" IS NULL;

-- Ensure a 50% coverage package exists
INSERT INTO "CoveragePackage" (name, "nameLocalized", "depositPercent", description, "isActive", "createdAt", "updatedAt")
SELECT 'Покриття 50%', NULL, 50, NULL, true, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "CoveragePackage"
    WHERE "depositPercent" = 50 AND "deletedAt" IS NULL
);

-- Also rename any existing 50% row (in case one already exists with another name)
UPDATE "CoveragePackage"
SET name = 'Покриття 50%'
WHERE "depositPercent" = 50 AND "deletedAt" IS NULL;

SELECT id, name, "depositPercent", "isActive" FROM "CoveragePackage" WHERE "deletedAt" IS NULL ORDER BY "depositPercent";

COMMIT;
