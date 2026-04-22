-- Bring frozen priceSnapshot.coveragePackageName on existing rentals/reservations
-- in line with the new package names.
-- Idempotent — WHERE clauses match only the legacy names.

BEGIN;

-- Rental snapshots
UPDATE rental
SET price_snapshot = jsonb_set(price_snapshot, '{coveragePackageName}', '"Покриття 100%"')
WHERE price_snapshot->>'coveragePackageName' = 'Basic';

UPDATE rental
SET price_snapshot = jsonb_set(price_snapshot, '{coveragePackageName}', '"Без покриття"')
WHERE price_snapshot->>'coveragePackageName' = 'Full';

UPDATE rental
SET price_snapshot = jsonb_set(price_snapshot, '{coveragePackageName}', '"Покриття 50%"')
WHERE price_snapshot->>'coveragePackageName' = 'Medium';

-- Reservation snapshots
UPDATE reservation
SET price_snapshot = jsonb_set(price_snapshot, '{coveragePackageName}', '"Покриття 100%"')
WHERE price_snapshot->>'coveragePackageName' = 'Basic';

UPDATE reservation
SET price_snapshot = jsonb_set(price_snapshot, '{coveragePackageName}', '"Без покриття"')
WHERE price_snapshot->>'coveragePackageName' = 'Full';

UPDATE reservation
SET price_snapshot = jsonb_set(price_snapshot, '{coveragePackageName}', '"Покриття 50%"')
WHERE price_snapshot->>'coveragePackageName' = 'Medium';

SELECT 'rental' AS table_, id, price_snapshot->>'coveragePackageName' AS cov_name, price_snapshot->>'depositPercent' AS pct
FROM rental WHERE price_snapshot->>'coveragePackageName' IS NOT NULL
UNION ALL
SELECT 'reservation', id, price_snapshot->>'coveragePackageName', price_snapshot->>'depositPercent'
FROM reservation WHERE price_snapshot->>'coveragePackageName' IS NOT NULL
ORDER BY table_, id;

COMMIT;
