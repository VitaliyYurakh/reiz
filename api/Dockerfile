# Multi-stage build: compile TypeScript in `builder`, ship a lean runner
# image that runs the emitted JS via `node` directly. Pre-multi-stage we
# ran `tsx app/index.ts` at runtime — slower cold-start, transpile errors
# only surfaced in production, and the entire devDeps chain (eslint,
# vitest, typescript) shipped to prod.

# ─── Stage 1: deps (full install for the build) ─────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# ─── Stage 2: builder (compile TS + generate Prisma client) ─────────────
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma client must be regenerated against this image's exact
# OpenSSL/libc combo, otherwise `node build/...` blows up with
# "PrismaClientInitializationError" mentioning a missing query engine
# binary. Doing it in the builder also catches schema drift early.
RUN npx prisma generate
RUN npm run build

# Sanity gate: the runner CMD points at this exact file. Fail the build
# loudly here if tsc didn't emit it (saves a useless deploy that crashes
# on container start).
RUN test -f build/app/index.js || (echo 'tsc did not emit build/app/index.js — check tsconfig.json `include`/`outDir`' && exit 1)

# ─── Stage 3: runner (production deps + compiled JS only) ───────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat wget

# Install only `dependencies` (drops typescript, eslint, vitest, etc).
# `prisma` CLI + `tsx` live in `dependencies` because they're needed at
# runtime: `prisma migrate deploy` for migrations and `tsx prisma/seed.ts`
# via the prisma seed config.
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Bring over what runtime actually reads: compiled JS + Prisma migrations
# + the seed source (still TS because `prisma db seed` invokes
# `tsx prisma/seed.ts` per package.json — small file, not worth a
# separate compile pipeline).
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma
# Generated Prisma client lives under node_modules/@prisma/client; copy
# it from the builder so we don't need to re-run `prisma generate` here
# (which would require all of `prisma/schema.prisma` and the engines).
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Static-file mounts (express.static) write nothing; uploads/ is bind-
# mounted from the host in docker-compose.yml so it persists across
# container rebuilds.

EXPOSE 3000

# Health check — Docker pings /api/health, which executes a SELECT 1
# against Postgres. If the API stops responding (or DB is unreachable)
# Docker marks the container `unhealthy` and Caddy stops sending traffic
# to it. Without this, a crashed-but-still-running container looks
# healthy and silently 502s.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget --quiet --spider --tries=1 http://localhost:3000/api/health || exit 1

# Production startup:
#   * `prisma migrate deploy` — single source of truth for schema. Never
#     `db push --accept-data-loss` (could DROP+CREATE on perceived
#     renames, silently destroying data).
#   * `prisma db seed` — idempotent (uses `upsert` / `count == 0` guards).
#   * `node build/app/index.js` — runs the compiled output directly. No
#     transpile step at runtime, no devDeps in the image, ~50% faster
#     cold-start vs the previous `tsx` setup.
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node build/app/index.js"]
