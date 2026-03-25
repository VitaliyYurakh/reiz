-- Delete existing counting rules for Mazda CX-5 (car_id = 25)
DELETE FROM "CarCountingRule" WHERE "car_id" = 25;

-- Insert coverage rules: no coverage, 50% (+$18/day), 100% (+$29/day)
INSERT INTO "CarCountingRule" ("price_percent", "deposit_percent", "price_fixed", "car_id")
VALUES
  (0, 0, NULL, 25),
  (0, 50, 18, 25),
  (0, 100, 29, 25);
