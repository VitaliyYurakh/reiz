# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reiz is a car rental platform with a monorepo structure containing:
- **`/front`** - Next.js 15 frontend (React 19, TypeScript, Turbopack)
- **`/api`** - Express.js backend with Prisma ORM and PostgreSQL

## Development Commands

### Frontend (`/front`)
```bash
npm run dev          # Start dev server with Turbopack (port 3000)
npm run build        # Production build
npm run build:analyze # Build with bundle analyzer
npm run lint         # Run Biome linter
npm run format       # Format with Biome
npm run build:icons  # Generate SVG sprite from public/img/icons/
```

### Backend (`/api`)
```bash
npm run dev          # Start with nodemon (port 3000)
npm run build        # TypeScript compile to /build
npm run lint         # Run ESLint + Prettier check
npm run format       # Auto-fix with ESLint + Prettier
npx prisma generate  # Generate Prisma client
npx prisma migrate dev # Run migrations
npx prisma db seed   # Seed database (tsx prisma/seed.ts)
```

### Docker (full stack)
```bash
docker-compose up    # Start all services (api, web, postgres, caddy)
```

## Architecture

### Frontend Structure
- **`src/app/[locale]`** - Next.js App Router with i18n (uk, ru, en). Ukrainian (`uk`) is default and served at root path.
- **`src/app/[locale]/(site)`** - Public pages: about, blog, cars, contacts, faq, insurance, terms, etc.
- **`src/app/admin`** - Admin panel (no i18n)
- **`src/components`** - Shared components (Header, Footer, modals, UI elements)
- **`src/context`** - React contexts (CurrencyContext, RentalSearchContext, CatalogFiltersContext)
- **`src/i18n`** - Internationalization config and translation JSON files
- **`src/lib/api`** - API client functions (cars.ts, admin.ts)
- **`src/lib/seo.ts`** - SEO metadata helpers

### Backend Structure
- **`app/index.ts`** - Express server entry point
- **`app/routers`** - Route definitions (auth, car, segment, feedback)
- **`app/controllers`** - Request handlers
- **`app/services`** - Business logic (CarService, etc.)
- **`app/middleware`** - Auth and other middleware
- **`prisma/schema.prisma`** - Database schema (User, Car, Segment, RentalTariff, CarPhoto, CarCountingRule)

### API Routes
All routes prefixed with `/api`:
- `/api/auth` - Authentication
- `/api/car` - Car CRUD operations
- `/api/segment` - Car segments/categories
- `/api/feedback` - User feedback

Static files served from `/static` (uploads directory).

## Key Technologies

- **Frontend**: Next.js 15, React 19, next-intl, Biome, SASS, Swiper, air-datepicker
- **Backend**: Express 5, Prisma, PostgreSQL, Pino logger, JWT auth, Multer for uploads
- **Deployment**: Docker Compose with Caddy reverse proxy

## Code Style

- Frontend uses Biome (2-space indent, organized imports)
- Backend uses ESLint + Prettier (4-space indent, single quotes, no bracket spacing)
- Both use TypeScript

## Important Notes

- i18n uses `localePrefix: "as-needed"` - Ukrainian content at root `/`, other locales at `/ru`, `/en`
- Legacy `/uk/*` URLs redirect 301 to root
- Frontend fetches data from `API_URL` env variable with ISR revalidation
- Car photos have MOBILE and PC variants
- Currency conversion handled client-side via CurrencyContext
