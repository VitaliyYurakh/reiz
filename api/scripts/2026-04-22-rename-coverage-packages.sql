-- Rename coverage packages to match the real semantic of deposit_percent
-- (which is the coverage level, not deposit %).
-- Safe to re-run — UPDATEs are idempotent, INSERT guarded by WHERE NOT EXISTS.

BEGIN;

-- 0% coverage → "Без покриття"
UPDATE coverage_package
SET name = 'Без покриття'
WHERE deposit_percent = 0 AND deleted_at IS NULL;

-- 100% coverage → "Покриття 100%"
UPDATE coverage_package
SET name = 'Покриття 100%'
WHERE deposit_percent = 100 AND deleted_at IS NULL;

-- Ensure a 50% coverage package exists
INSERT INTO coverage_package (name, name_localized, deposit_percent, description, is_active, created_at)
SELECT 'Покриття 50%', NULL, 50, 'Половинне покриття, зменшена застава', true, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM coverage_package
    WHERE deposit_percent = 50 AND deleted_at IS NULL
);

-- Rename any existing 50% row (in case one already exists with another name)
UPDATE coverage_package
SET name = 'Покриття 50%'
WHERE deposit_percent = 50 AND deleted_at IS NULL;

SELECT id, name, deposit_percent, is_active FROM coverage_package WHERE deleted_at IS NULL ORDER BY deposit_percent;

COMMIT;
