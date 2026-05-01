FROM node:20-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate

EXPOSE 3000

# Production startup:
#   * `migrate deploy` is the ONLY schema-applying step. We deliberately
#     dropped `prisma db push --accept-data-loss` from the previous CMD —
#     it relied on Prisma's diff heuristics and could DROP+CREATE tables
#     on perceived renames, which would silently destroy data (cars,
#     photos, …). Migrations are now the single source of truth.
#   * `db seed` is idempotent (uses `upsert` / `count == 0` guards).
#   * `tsx` runs TS sources directly. We tried `node build/app/index.js`
#     after a `npm run build` step but the codebase has pre-existing
#     tsc errors that bail tsc emit before reaching `app/index.ts`,
#     leaving no entry to run. Until those warnings are cleaned up
#     (separate PR), tsx is the pragmatic prod runner — it's the same
#     thing nodemon was wrapping, minus the file watcher and restart
#     overhead.
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npx tsx app/index.ts"]
