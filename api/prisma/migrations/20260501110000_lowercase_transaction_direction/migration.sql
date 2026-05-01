-- Normalize Transaction.direction values to lowercase. Prior to the
-- 2026-05-01 fix, four call sites wrote 'IN' / 'OUT' (uppercase) while
-- the rest of the system filtered by 'in' / 'out' (lowercase). The code
-- side has been aligned (every writer now uses lowercase), but the
-- legacy uppercase rows still sit in the database, which forced a
-- defensive `.toLowerCase()` in every reader.
--
-- This data migration brings every existing row into the lowercase
-- canonical form so the readers can be cleaned up. Idempotent — running
-- it again is a no-op because no row will satisfy the WHERE clause.

UPDATE "transaction"
SET direction = LOWER(direction)
WHERE direction <> LOWER(direction);
