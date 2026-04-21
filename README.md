# Reiz - Car Rental Platform

Modern car rental platform with Telegram integration for instant notifications.

## Features

- 🚗 Car rental management
- 📱 Telegram bot notifications for bookings
- 🌍 Multi-language support (Ukrainian, Russian, English)
- 💰 Multi-currency support (EUR, UAH, USD)
- 📊 Admin panel

## Tech Stack

**Frontend:**
- Next.js 15 with Turbopack
- React 19
- TypeScript
- SASS

**Backend:**
- Node.js with Express
- Prisma ORM
- PostgreSQL
- Telegram Bot API

## Deployment

The application automatically deploys to production when pushing to the `main` branch via GitHub Actions.

## Production setup

1. Copy `.env.example` to `.env` and fill in every secret. Generate
   `POSTGRES_PASSWORD` with `openssl rand -hex 24`.
2. Tighten permissions on files containing secrets so they are not
   world-readable (addresses audit M-1):
   ```bash
   chmod 600 /opt/reiz/.env /opt/reiz/api/.env
   ```
3. Seed idempotently with `npx prisma db seed` — the admin password is
   **never** overwritten on re-runs (see `api/prisma/seed.ts` and
   `api/prisma/MIGRATIONS_POLICY.md`).
4. Rotate the admin password after first login through the admin UI
   (`/admin/settings → Team → Edit → Change password`); the default
   `admin@example.com / admin123` credential from the seed must never
   reach a live environment.

## Rotating POSTGRES_PASSWORD on a running cluster

Changing `POSTGRES_PASSWORD` in `.env` alone does **not** propagate to an
existing Postgres volume — that password was hashed into the role at
volume-init time. To rotate without data loss:

```bash
docker exec -it reiz-postgres-1 psql -U postgres -c \
  "ALTER USER postgres WITH PASSWORD '<new_strong_password>';"
# then update .env and restart dependent services
docker compose up -d api web
```

