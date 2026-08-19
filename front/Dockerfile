FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# geoip-lite ships city-level databases (~150MB) we never query — the
# consent-banner geo check only ever reads .country. Country-level lookup
# degrades gracefully without these files (still returns country, just
# empty city/region/timezone), so drop them to keep the image lean.
RUN rm -f node_modules/geoip-lite/data/geoip-city.dat \
           node_modules/geoip-lite/data/geoip-city6.dat \
           node_modules/geoip-lite/data/geoip-city-names.dat

FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma generate for customer auth schema
RUN npx prisma generate

# Auth.js needs these at build time for static pages
ARG NEXT_PUBLIC_BASE_URL=https://reiz.com.ua/
ARG NEXT_PUBLIC_API_URL=https://reiz.com.ua/api
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY

RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8080 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

RUN mkdir -p .next/cache && chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 8080
CMD ["node", "server.js"]
