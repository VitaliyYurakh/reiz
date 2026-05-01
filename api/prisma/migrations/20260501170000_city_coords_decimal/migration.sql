-- Convert city.latitude / city.longitude from `text` to `numeric(10,7)`.
-- The seed inserts coordinates as strings like '49.842957', '24.031111';
-- 7 fractional digits is ~11 mm precision at the equator (way more than
-- a pickup marker needs) and Decimal avoids IEEE-754 rounding when the
-- frontend computes distances or pixel positions on a map tile.
--
-- All existing rows already contain values that parse as decimals
-- (verified — every seed entry follows the pattern). USING cast is safe.

ALTER TABLE city
    ALTER COLUMN latitude TYPE numeric(10, 7) USING latitude::numeric(10, 7);

ALTER TABLE city
    ALTER COLUMN longitude TYPE numeric(10, 7) USING longitude::numeric(10, 7);
