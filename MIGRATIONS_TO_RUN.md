# Migrations to run on prod

As of this PR series: **no new Prisma migrations are required**.

Every fix that touched the API layer in blocks 1–5 stayed on the code
side:

- Index / transaction wrapping around existing tables.
- Validator schemas tightened at the Zod layer, not the DB layer.
- Audit-log writes go through the existing `audit_log` table.
- Policy docs and seed refactors do not change DDL.

## What DOES need a one-time runtime action on prod

These are **not Prisma migrations** — they are manual ops the deployer
must perform after `docker compose up`:

1. **Rotate the admin password (audit C-1).**
   Reason: the prod record for `admin@example.com` still hashes to
   `admin123`. The seed fix (C-2) stops new seeds from overwriting it,
   but it does not change the stored value.
   Action (choose one):
   - Log in to `/admin/login` with current creds, go to
     `/admin/settings → Team → Edit → Change password`, set a strong
     password. `tokenVersion` now auto-increments on change (H-1), so
     all existing JWTs are revoked immediately.
   - Or run on prod:
     ```sql
     UPDATE "User"
       SET pass = '<new_bcrypt_hash>',
           token_version = token_version + 1
     WHERE email = 'admin@example.com';
     ```
     Generate the hash with `bcrypt.hash('<new_plain_password>', 12)`
     locally — do not commit the value.

2. **Rotate POSTGRES_PASSWORD (audit M-2).**
   The volume was initialised with the hardcoded `postgres_dev`.
   `.env` is now the single source of truth (see
   `README.md#rotating-postgres_password-on-a-running-cluster`).

3. **Tighten `/opt/reiz/.env` file permissions (audit M-1).**
   ```bash
   chmod 600 /opt/reiz/.env /opt/reiz/api/.env
   ```

4. **Regenerate the Prisma client on the API container** (so the
   existing `tokenVersion` column is typed by the client — fixes the
   pre-existing tsc noise captured in step 4.1):
   ```bash
   docker exec reiz-api-1 npx prisma generate
   ```
   Or let the next image rebuild handle it.

## Follow-up Prisma migrations flagged as deferred

None of the items below ship in this PR. They belong in their own,
data-migration-aware PRs because they alter types or rewrite content:

- `Car.overmileagePrice`, `Segment.overmileagePrice`, `Car.damage*Fee`,
  `Car.cleaningFee`, `Car.cross_border_fee`, `Transaction.fx_rate` —
  change `Float` to `Int` (minor units) or `Decimal(12,2)`. Every
  existing value must be converted in the same migration so no penny is
  lost — see `api/prisma/MIGRATIONS_POLICY.md` rule 2.
- Backfill `price_snapshot` on the five reservations created before the
  unit-mismatch fix (audit C-4) if their cars were later given
  `RatePlan` rows with different numbers. Needs manual confirmation
  per-reservation.
- Drop the legacy `RentalTariff` / `CarCountingRule` models once the
  public site is confirmed to read only `RatePlan` + `CoveragePackage`
  (audit C-6 is currently patched in the fallback path, not eliminated
  at the schema level).
