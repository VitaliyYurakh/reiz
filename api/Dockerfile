FROM node:20-alpine AS deps
WORKDIR /usr/src/app
# devDeps included intentionally — we need tsc here (build stage) and
# tsx in the runtime stage for `prisma db seed`.
COPY package*.json ./
RUN npm ci

FROM deps AS builder
COPY . .
RUN npx prisma generate
# tsc is now clean (no `|| true` fallback) — every file emits.
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Bring runtime artefacts from the builder. node_modules carries tsx
# (devDep) which `prisma db seed` invokes per package.json's
# `prisma.seed` config; without it the seed crashes with `spawn tsx
# ENOENT` and the container restart-loops.
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 3000

# Production startup:
#   * `migrate deploy` is the ONLY schema-applying step. We deliberately
#     dropped `prisma db push --accept-data-loss` from the previous
#     pipeline — it relied on Prisma's diff heuristics and could
#     DROP+CREATE tables on perceived renames, silently destroying data
#     (cars, photos). Migrations are now the single source of truth.
#   * `db seed` is idempotent (uses `upsert` / `count == 0` guards).
#   * Compiled JS via `node build/app/index.js` — no nodemon, no tsx
#     in the runtime hot path.
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node build/app/index.js"]
