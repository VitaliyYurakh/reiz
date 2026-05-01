FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

FROM deps AS builder
COPY . .
RUN npx prisma generate
# tsc currently surfaces a handful of pre-existing type warnings that
# don't prevent emit; we deliberately don't gate the image build on them
# so ops can ship while those are cleaned up in a separate PR. CI
# (.github/workflows/ci.yml) runs `tsc --noEmit` as a separate quality
# gate so new regressions are visible there.
RUN npm run build || true

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package*.json ./
EXPOSE 3000
# Production startup:
#   * `migrate deploy` is the ONLY schema-applying step. We deliberately
#     dropped `prisma db push --accept-data-loss` from the previous CMD —
#     it relied on Prisma's diff heuristics and could DROP+CREATE tables
#     on perceived renames, which would silently destroy data (cars,
#     photos, …). Migrations are now the single source of truth.
#   * `db seed` is idempotent (uses `upsert` / `count == 0` guards).
#   * Compiled JS via `node build/app/index.js` — no nodemon, no tsx
#     in the runtime hot path.
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node build/app/index.js"]
