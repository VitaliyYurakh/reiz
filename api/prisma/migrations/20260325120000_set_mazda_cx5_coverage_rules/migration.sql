-- Delete existing counting rules for Mazda CX-5 (car_id = 25)
DELETE FROM "CarCountingRule" WHERE "car_id" = 25;

-- Insert coverage rules: no coverage, 50% (+$18/day), 100% (+$29/day)
-- Only if car 25 exists (data migration — safe to skip on empty DB)
INSERT INTO "CarCountingRule" ("price_percent", "deposit_percent", "price_fixed", "car_id")
SELECT v."price_percent", v."deposit_percent", v."price_fixed", v."car_id"
FROM (VALUES
  (0, 0, NULL::int, 25),
  (0, 50, 18, 25),
  (0, 100, 29, 25)
) AS v("price_percent", "deposit_percent", "price_fixed", "car_id")
WHERE EXISTS (SELECT 1 FROM "Car" WHERE "id" = 25);
