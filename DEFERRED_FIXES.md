# Deferred fixes and newly surfaced findings

Items the current audit-fix PR series intentionally leaves for later.
Every entry ends with the shape of the future PR that would close it.

## A. Schema work that needs a data migration

### A-1. Money columns still typed `Float` (audit C-5)

`Car.overmileagePrice`, `Car.damage*Fee`, `Car.intercityDeliveryPrice`,
`Car.lateReturnFeePerHour`, `Car.youngerDriverSurcharge`,
`Car.unlimitedMileagePrice1Day|2to7`, `Car.additionalDriverFee`,
`Car.equipmentRentalPrice`, `Car.afterHoursServiceFee`,
`Car.empty_tank_fee`, `Car.car_wash_price`,
`Segment.overmileagePrice`, `Transaction.fxRate` — all `double precision`.

Float is unsafe for money: `0.1 + 0.2 !== 0.3`. Cannot be fixed in a
drop-in migration — each existing row must be converted to `Int`
(minor units) or `Decimal(12, 2)`. Needs its own PR with:

- New nullable `*_minor` columns.
- Backfill script in `api/scripts/yyyy-mm-dd-float-to-minor.ts` that
  rounds to cents in one authoritative place.
- Read-path shim for one release while both columns coexist.
- Drop of the old column in a follow-up.

### A-2. `RentalRequestStatus` constant out of sync with DB (new finding from 5.5)

`api/app/utils/constants.ts` exposes `PENDING / APPROVED / REJECTED /
CANCELLED`. Prod rows use `new / in_review / approved / rejected /
cancelled`. The fix in block 5.5 used string literals rather than the
constant to match reality. Future PR should align the enum with the
data, or replace both with a real Prisma enum.

### A-3. Eliminate the legacy pricing tables (audit C-6)

`RentalTariff` + `CarCountingRule` are now fallback-only. Once the
public site is confirmed to read exclusively from `RatePlan` +
`CoveragePackage`, drop these tables. See
`api/prisma/MIGRATIONS_POLICY.md` rules 2 and 4 for how to do it
without risking data loss.

## B. Tooling and types

### B-1. Biome can't find an ignore file (pre-existing, surfaced during 4.3)

`front/biome.json` sets `vcs.useIgnoreFile: true` but the `front/`
directory has no `.gitignore`. Lint currently fails with
`Biome couldn't find an ignore file`. Fix: either point biome at the
repo-root `.gitignore` or add a `.biomeignore`.

### B-2. Prisma client types stale locally (pre-existing, surfaced during 4.1)

`npx prisma generate` has not been rerun since 2026-04-07. Locally
`tokenVersion` and `cityAvailability` show tsc errors. Regenerate in
CI and as part of the deploy image build.

### B-3. Widespread `any` in admin (audit M-6)

47 `: any` annotations in admin code. Gradual typing pass; start with
`cars/[idSlug]/page.tsx` `rentalConditions` and the axios response
shapes.

## C. Product / feature gaps surfaced by the audit

### C-1. Notification templates exist but are never auto-fired (new finding N-1)

Seed defines 8 templates (`NEW_REQUEST`, `REQUEST_APPROVED`,
`REQUEST_REJECTED`, `PICKUP_TODAY`, `RETURN_TODAY`, `OVERDUE`,
`INSURANCE_EXPIRING`, `SERVICE_DUE`). Block 4's H-2 fix unblocks the
send path, but nothing in `rentalRequestService`,
`reservationService`, `rentalService` actually calls
`notificationService.send(code, …)` at the right moments.

Future PR: wire each template to its trigger. `OVERDUE` has a manual
endpoint (`POST /report/overdue/notify`); for `PICKUP_TODAY` /
`RETURN_TODAY` / `INSURANCE_EXPIRING` / `SERVICE_DUE` you need a
cron-style scheduler (node-cron or a small script invoked from
GitHub Actions).

### C-2. Admin still uses inline-styles + Tailwind mix (audit L-6)

Design-token consolidation; not blocking but costs maintainability.

### C-3. `calendar.service.getData` has no carId cap (audit L-7)

Works at 13 cars. At 300 cars with 10k reservations it will start to
hurt. Add `take`/pagination when the catalog grows.

### C-4. `audit.middleware` deep-clones before/after via JSON (audit L-9)

`JSON.parse(JSON.stringify(...))` is fine at current volume, sluggish
when `Car.before` carries the full 60-column record on every update.
Switch to `structuredClone` when Node upgrade allows.

## D. Operational hardening

### D-1. Distributed rate limiter / lockout (audit H-9)

In-memory, per-process. Fine for a single replica, broken on horizontal
scale. Move to a `rate-limit-redis` store once ops stands up a Redis
instance.

### D-2. Cross-origin admin (audit H-10)

Currently not an issue (same eTLD+1). If admin ever moves to
`admin.reiz.com.ua`, `sameSite: 'strict'` will break cookie flow — the
fix is known (`sameSite: 'none'; secure: true` + CORS), just noting.

### D-3. Self-service password change for non-admin managers (audit L-10)

`ProfileTab` only displays the user; there is no "change my password"
form. Currently a manager has to ask an admin to change it via
`/admin/settings → Team`. Small UX gap, not security.

## E. Closed by later audit runs — track, don't fix again

- `L-1 … L-11` in the original audit are intentionally left open. If a
  cleanup sprint is scheduled, they are the backlog.
