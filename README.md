# Reiz — Car Rental Platform

Lviv-based car rental with public site, customer cabinet, admin CRM,
and a B2B outreach pipeline. Five locales (uk/ru/en/pl/ro), three
display currencies, money stored as `Int *Minor` (копійки/cents).

## Stack

**Frontend** — Next.js 15 (App Router, Turbopack) · React 19 · TypeScript
· next-intl · Tailwind v4 (admin) + SASS (site) · Biome.

**Backend** — Express 5 · Prisma 6 + PostgreSQL 16 · Zod runtime
validation · JWT (httpOnly cookies, rotating tokenVersion) · 2FA TOTP
opt-in · Pino structured logging with AsyncLocalStorage requestId.

**Infra** — Docker Compose · Caddy reverse proxy with auto-SSL · Sentry
(DSN-gated, 10% transaction sampling in prod) · GitHub Actions CI/CD
(unit + integration tests with testcontainers, multi-stage Docker
build, no-cache deploy).

## Local dev

```bash
# Frontend
cd front && npm install && npm run dev      # :3000 with Turbopack

# Backend
cd api && npm install
cp .env.example .env                         # fill secrets
npx prisma migrate dev                       # apply migrations
npm run dev                                  # :3000 via nodemon + tsx

# Tests
npm test                                      # unit (mocked Prisma, fast)
npm run test:integration                      # spins real Postgres via testcontainers
```

## Deployment

`git push origin main` triggers GitHub Actions:

1. `ci · api` — `prisma validate`, `prisma generate`, `npm test`
2. `ci · api integration` — testcontainers + Postgres 16, runs
   the integration suites against a fresh DB
3. `ci · front` — Next.js production build
4. `deploy · prod` — `docker compose down && docker compose build
   --no-cache && docker compose up -d` over SSH (gated by all three
   CI jobs passing). The `--no-cache` step is intentional — works
   around a BuildKit COPY cache pitfall on scp'd source.

The api container's CMD runs `prisma migrate deploy && prisma db
seed && node build/app/index.js` — compiled JS, no `tsx` at runtime.

## Production setup

1. `cp .env.example .env`, fill all secrets, generate
   `POSTGRES_PASSWORD` with `openssl rand -hex 24`.
2. `chmod 600 /opt/reiz/.env /opt/reiz/api/.env` (audit M-1).
3. `npx prisma db seed` is idempotent — admin password is **never**
   overwritten on re-runs (see `api/prisma/seed.ts` and
   `api/prisma/MIGRATIONS_POLICY.md`).
4. Rotate the admin password after first login through
   `/admin/settings → Команда → Edit → Change password`. The default
   `admin@example.com / admin123` from the seed must never reach a
   live environment.

### Rotating POSTGRES_PASSWORD on a running cluster

Changing `POSTGRES_PASSWORD` in `.env` alone does **not** propagate
to an existing Postgres volume — that password was hashed into the
role at volume-init time. To rotate without data loss:

```bash
docker exec -it reiz-postgres-1 psql -U postgres -c \
  "ALTER USER postgres WITH PASSWORD '<new_strong_password>';"
docker compose up -d api web      # then update .env and restart
```

## Architecture notes

* **All money is `Int *Minor`** (копейки for UAH, cents for USD/EUR).
  `Float` was banned for monetary fields after the 2026-05-02 audit —
  IEEE-754 rounding was a real liability.
* **i18n via translation tables** — every localized string
  (Car description/spec, City names, PickupLocation names,
  CoveragePackage/AddOn names, configuration options) lives in a
  per-entity translation table with `(entityId, locale)` unique
  constraint and per-locale index. Adding a 6th locale anywhere is a
  backfill, not a schema change.
* **RBAC via `Role` table** — permissions are `{module: 'none' |
  'view' | 'full'}` JSON on the Role row. 17 modules in the registry
  (`api/app/types/permissions.ts`). The seeded Admin role has every
  module at `full`; manage other roles via `/admin/settings → Ролі`.
* **Soft-delete** for Client/Rental/Reservation (and several
  catalogue tables): a Prisma client extension auto-injects
  `where.deletedAt = null` on top-level reads and rewrites `delete()`
  to a `deletedAt = now()` update. Bypass via `rawPrisma()` for
  restore endpoints. See `api/app/utils/db.utils.ts`.
* **CHECK constraints** on every monetary column (`>= 0`), driver
  ages (16–99), city coordinates (lat/long valid), percent fields
  (0–100). Caught at the DB layer with named errors.

## Repo layout

```
api/         Express + Prisma backend
  app/       routes, controllers, services, middleware, validators
  prisma/    schema.prisma, migrations/, seed.ts
  tests/integration/  testcontainers + Postgres suites
front/       Next.js frontend (public site + admin)
  src/app/[locale]/(site)        public car-rental site
  src/app/admin/(dashboard)      admin CRM panel
  src/i18n/admin/                admin locale dictionaries (uk/ru/en/pl/ro)
docker-compose.yml               api + web + postgres + caddy
Caddyfile                        reverse proxy config
.github/workflows/deploy.yml     CI + deploy pipeline
```
