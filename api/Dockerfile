FROM node:20-alpine
WORKDIR /usr/src/app

# Install all deps first (tsc is dev, tsx is dev) — we run TS via tsx
# at runtime because `node:20-alpine` tsc doesn't emit `build/app/index.js`
# even though Mac tsc and the Ubuntu setup-node tsc do (case-sensitive
# alpine + slightly older Node patch). Until we either find the alpine
# emit fix or pin a node:20-bookworm-slim image, tsx is the safe runner.
# Flip NODE_ENV after install so devDeps land.
COPY package*.json ./
RUN npm ci

ENV NODE_ENV=production

COPY . .
RUN npx prisma generate

EXPOSE 3000

# Health check — Docker pings /api/health, which executes a SELECT 1
# against Postgres. If the API stops responding (or DB is unreachable)
# Docker marks the container `unhealthy` and Caddy stops sending traffic
# to it. Without this, a crashed-but-still-running container looks
# healthy and silently 502s.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --quiet --spider --tries=1 http://localhost:3000/api/health || exit 1

# Production startup:
#   * `migrate deploy` is the ONLY schema-applying step. We deliberately
#     dropped `prisma db push --accept-data-loss` from the previous
#     pipeline — it relied on Prisma's diff heuristics and could
#     DROP+CREATE tables on perceived renames, silently destroying data
#     (cars, photos). Migrations are now the single source of truth.
#   * `db seed` is idempotent (uses `upsert` / `count == 0` guards).
#   * `tsx app/index.ts` runs TS sources directly (one process, no file
#     watcher, no compilation step). Switch to `node build/app/index.js`
#     once the alpine tsc-emit issue is resolved.
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npx tsx app/index.ts"]
