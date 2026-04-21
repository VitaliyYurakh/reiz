# Migrations Policy

This document sets hard rules for Prisma migrations in the `/api` project.
It exists because of a real incident — see [Cautionary Tale](#cautionary-tale-c-3) below.

## Golden rules

1. **Never write password resets in migrations.**
   Passwords, tokens, 2FA secrets, API keys — any credential — are **runtime
   state**, not schema. Changing them belongs in:
   - admin UI / API (`POST /user/:id/password`)
   - manual SQL executed by a human on the prod DB, not committed to the repo

   A migration that does `UPDATE "User" SET pass = '…'` will be re-applied
   on any fresh environment restore (disaster recovery, staging snapshot,
   new developer onboarding) — effectively planting a backdoor in every
   environment that touches the schema history.

2. **No destructive DDL without explicit rollback plan.**
   Every migration that does any of the following **must** include a
   `-- ROLLBACK: <sql>` comment at the top describing how to reverse it:
   - `DROP TABLE`, `DROP COLUMN`, `DROP INDEX`
   - `ALTER COLUMN ... TYPE` (always include a `USING` clause that
     guarantees safe conversion of existing values)
   - `TRUNCATE`, `DELETE` without `WHERE`
   - Any `UPDATE` / `INSERT` that alters business data

3. **Schema-only, not data. Data changes go elsewhere.**
   Prisma migrations are for **structure** (tables, columns, indexes,
   constraints, enums). Bulk data changes (backfills, re-computations,
   normalizations) live in `api/scripts/<yyyy-mm-dd>-<name>.ts` — idempotent
   TypeScript files you run manually on prod via `ts-node`. They can be
   repeated without harm and leave an obvious audit trail outside the
   migration history.

4. **Protect load-bearing tables.**
   The following tables hold core business data and are **not to be altered
   destructively** without sign-off from the project owner:
   - `Car`, `CarPhoto`, `RentalTariff`, `CarCountingRule`, `Segment`
   - `rate_plan`, `_CarToSegment`, `car_city_availability`
   - `client`, `reservation`, `rental`, `transaction`, `audit_log`

   If your migration touches any of these, add a second comment above the
   `-- ROLLBACK:` line explaining *why* the change cannot lose existing
   records.

5. **Never rename columns without `@map`.**
   Prisma rename-detection is based on field names. Renaming a field in
   `schema.prisma` without an `@map("old_name")` results in DROP + ADD —
   i.e. silent data loss. Always use `@map` or write a manual migration
   with `ALTER TABLE … RENAME COLUMN`.

6. **Don't run `prisma migrate dev` on prod.**
   Only `prisma migrate deploy` touches prod. Locally, always use
   `prisma migrate dev --create-only --name <name>` first, show the SQL
   to a second pair of eyes, then apply.

7. **Seed is not a migration.**
   `seed.ts` runs separately from migrations and is expected to be
   idempotent. It may `upsert` reference data (Segment, AddOn,
   CoveragePackage, NotificationTemplate), but:
   - `update: {}` for anything that already exists and is user-editable
     (see `seed.ts` admin upsert for the pattern)
   - Never create/modify `Car`, `CarPhoto`, `RentalTariff`,
     `CarCountingRule` in seed — those are edited by admins and any
     update-path in seed risks overwriting live prod data.

## Process for a new migration

1. Make your schema change in `prisma/schema.prisma`.
2. Generate the migration file **without applying it**:
   ```bash
   npx prisma migrate dev --create-only --name <descriptive_name>
   ```
3. Open the generated `.sql` file and:
   - Read every statement. Does it match what you expected?
   - Add `-- ROLLBACK: <sql>` at the top.
   - If it touches any load-bearing table (rule 4), add the `-- WHY SAFE:`
     comment.
4. Show the SQL to a reviewer. Get explicit approval.
5. Apply locally: `npx prisma migrate dev`.
6. Verify on a local DB clone that nothing you didn't expect was changed.
7. Commit the migration folder **and** the updated `schema.prisma` together.
   Never commit one without the other.
8. On prod, the migration runs automatically during the deploy pipeline
   via `prisma migrate deploy`. Do not run it by hand.

## Cautionary tale (C-3)

On 2026-03-12 a migration named `20260312200000_reset_admin_password`
was committed and applied. Its SQL:

```sql
UPDATE "User"
SET pass = '$2b$12$J9eS8tRZSHlOVUvpBQP1wuw9KBqDRW3v5VqZQhiq9Xy4G23oKCsam'
WHERE email = 'admin@example.com';
```

The hash decodes to `admin123`. Combined with `seed.ts` that did the same
thing in its `update` branch (see C-2), this meant:

- **Every `db seed` run reset the prod admin password to `admin123`.**
- **The password was still `admin123` on 2026-04-21** (confirmed via SELECT
  against the production DB — hash matched byte-for-byte).
- Anyone who had read access to the repo (or guessed the default) could
  log in as admin and gain full CRM / finance / audit control.

The existing migration `20260312200000_reset_admin_password` is **not
being reverted** — rewriting applied migration history would break
`_prisma_migrations` bookkeeping and risks worse damage. It stays as a
permanent record of what must never happen again.

The mitigations now in place:

- `seed.ts` no longer overwrites `pass` (fix C-2).
- This policy document exists.
- The admin password itself is being rotated manually on prod (C-1).

## Questions / exceptions

If you believe you have a legitimate reason to break any of rules 1–7
(e.g. GDPR-mandated mass deletion, a schema field that truly must be
renamed without `@map`, a seed that must edit live data for compliance),
write it up in a PR description **before** opening the migration.
The bar for exceptions is: you can articulate (a) exactly what changes,
(b) why there is no alternative, (c) how you will verify afterwards that
nothing else was affected.
