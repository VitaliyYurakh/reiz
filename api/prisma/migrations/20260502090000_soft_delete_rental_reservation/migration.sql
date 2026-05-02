-- Add soft-delete columns to `rental` and `reservation`. Client already
-- had `deleted_at` from earlier; this brings the two financial-history
-- tables into the same shape so the Prisma client extension can filter
-- them all uniformly.
--
-- Both columns are NULL for existing rows (= "not deleted") so this is
-- a non-destructive ADD COLUMN. Indexed on `deleted_at` because the
-- extension's auto-injected `WHERE deleted_at IS NULL` runs on every
-- read; without the index Postgres would seq-scan to apply the filter.

ALTER TABLE rental      ADD COLUMN deleted_at TIMESTAMP(3);
CREATE INDEX rental_deleted_at_idx      ON rental(deleted_at);

ALTER TABLE reservation ADD COLUMN deleted_at TIMESTAMP(3);
CREATE INDEX reservation_deleted_at_idx ON reservation(deleted_at);
