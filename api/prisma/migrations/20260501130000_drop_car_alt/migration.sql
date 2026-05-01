-- Drop the dead `alt` column from `car`. It was added back when each car
-- carried a single hero image with its alt text, before the CarPhoto
-- table existed. Since CarPhoto rows arrived (each with its own `alt`
-- text per image), the top-level Car.alt has been written-only — set to
-- the literal default 'image' on every insert and never read back by
-- API or admin code (verified via grep). Dropping it removes the
-- mismatch where two columns claimed to own image alt text.
--
-- Pure cosmetic — no data is referenced. The 13 existing cars all have
-- alt='image' (the default), and removing the column doesn't touch any
-- car_photo rows.

ALTER TABLE car DROP COLUMN alt;
