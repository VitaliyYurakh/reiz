# Deploy checklist for the audit PR series

The five `fix/audit-block-*` branches touch API code, admin UI,
infrastructure docs, and the seed script. This checklist is the order
to do things in, and the smoke tests to run afterwards.

## 0. Prep (local)

- [ ] `git fetch` and review each branch individually:
  ```
  fix/audit-block-1-critical-finance-data
  fix/audit-block-2-seed-migrations-policy
  fix/audit-block-3-transactions
  fix/audit-block-4-security-audit
  fix/audit-block-5-medium-priority
  ```
- [ ] Merge into `main` in that order (each builds on previous
  assumptions — e.g. block 2 references block 1 commit messages).

## 1. Pre-deploy ops on prod

- [ ] `ssh root@72.60.84.20`
- [ ] `chmod 600 /opt/reiz/.env /opt/reiz/api/.env` (M-1)
- [ ] Add a fresh `POSTGRES_PASSWORD=$(openssl rand -hex 24)` line to
      `/opt/reiz/.env`. Leave the old `postgres_dev` value active in the
      DB for now — we rotate it AFTER the first `docker compose up` so
      the first boot doesn't fail.
- [ ] Verify `.env` now contains: API_SECRET, API_SALT, AUTH_SECRET,
      SERVICE_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
      NEXT_PUBLIC_TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY,
      TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, POSTGRES_PASSWORD.

## 2. Deploy

- [ ] `cd /opt/reiz && git pull origin main`
- [ ] `docker compose build api web` (API image picks up trust-proxy
      and transaction changes; web image bundles sonner + new
      middleware)
- [ ] `docker compose up -d api web caddy`
- [ ] `docker compose logs -f api | head -80` — look for
      `Server listening on port 3000` and no tsc/build errors.

## 3. Post-deploy ops on prod

- [ ] **Rotate admin password (C-1 — the one thing the automation
      cannot do for you).** Either log in with the old creds and use
      `/admin/settings → Team → Edit → Change password`, or run:
      ```bash
      docker exec -it reiz-api-1 node -e \
        "require('bcryptjs').hash('<NEW_PASSWORD>', 12).then(console.log)"
      # copy the printed hash, then:
      docker exec -it reiz-postgres-1 psql -U postgres -d reiz -c \
        "UPDATE \"User\" SET pass='<hash_from_above>', token_version = token_version + 1 WHERE email='admin@example.com';"
      ```
- [ ] **Rotate POSTGRES_PASSWORD (M-2).** See
      `README.md#rotating-postgres_password-on-a-running-cluster`.
      Short version:
      ```bash
      docker exec -it reiz-postgres-1 psql -U postgres -c \
        "ALTER USER postgres WITH PASSWORD '${POSTGRES_PASSWORD}';"
      docker compose up -d api web
      ```
- [ ] `docker exec reiz-api-1 npx prisma generate` (clears stale tsc
      types around `tokenVersion` / `cityAvailability`).

## 4. Smoke tests (production)

### Auth
- [ ] `/admin/login` with the NEW password → redirect to
      `/admin/dashboard`, no flash of dashboard HTML before auth
      (H-6).
- [ ] Try a bogus password five times → 429 after the fifth (C-8 + the
      existing lockout).
- [ ] Check `audit_log.ip_address` for those attempts — should now be
      real client IP, not `172.18.0.x` (C-8 trust proxy).

### Catalogue integrity (the "do not break" list)
- [ ] `/admin/cars` → still shows **13 cars**. Open one:
      photos, tariffs, counting rules and cities all present.
- [ ] Edit any car's `overmileagePrice` in the pricing tab → save →
      reload → value persisted (H-5 transaction).
- [ ] Create a new car via `+ Додати` → verify it has 4 default
      tariffs + 3 default counting rules immediately (H-3
      transactional createOne).
- [ ] Upload a car photo → toast "Фото завантажено" (M-5). Delete it
      → modal with red confirm → toast "Фото видалено".

### Pricing
- [ ] On a car that previously had **no RatePlan** (Mercedes S Class
      450 Long, Hyundai Elantra, Mazda CX-5, Hyundai Tucson,
      Kia Sportage, Toyota Corolla Cross), open
      `/admin/reservations/new`, select that car and a 3-day period —
      the calculated price must match
      `RentalTariff.dailyPrice × 3` in USD, not in cents/100 (C-4).
- [ ] Any admin GET to `/api/pricing/rate-plan` while NOT logged in
      returns 401 (C-9). With auth cookie, returns data.

### Documents
- [ ] Generate a RENTAL_CONTRACT PDF on the one rental that exists →
      PDF downloads. `audit_log` gets a `Document DOWNLOAD` entry
      (M-13).
- [ ] As a logged-in `manager` without `clients:view`, request
      `/static/client-documents/<known_filename>.pdf` → 403 (C-7).
- [ ] As the same manager, request
      `/static/1765732009848-bmw%203pc.webp` → 200 (public photos
      still work).

### CRM flow
- [ ] Submit a lead from the public site → appears in `/admin/requests`
      with status `new`.
- [ ] Approve it → reservation is created. Now try to approve the same
      request again → HTTP 400 "Cannot approve request in status
      approved" (M-12).
- [ ] Pick up the reservation → rental is created, admin redirected
      to `/admin/rentals/[id]`.
- [ ] Complete the rental with an odometer that triggers overmileage
      — the fee is calculated against `Car.overmileagePrice` first,
      segment fallback second (H-13).
- [ ] An inspection with `fuelLevel: 0` stores `0`, not `null` (H-12).

### Notifications
- [ ] After creating the lead above, a `NEW_REQUEST` message reaches
      the Telegram group (H-2 — the first time since launch).
- [ ] `notification_log` gets a row with `status='sent'`.

### Admin UI polish
- [ ] Save / delete / edit in any admin page → green toast on
      success, red toast with server message on failure (M-5).
- [ ] No native browser alerts/confirms anywhere.
- [ ] Dev console is empty of `console.error` noise (M-7).

## 5. Rollback plan

Each block is its own branch, so rollback granularity is clean:

| Problem | Revert |
|---|---|
| Pricing page doesn't load (C-9 broke a consumer) | Revert only the pricing-auth commit on block 1 |
| Telegram floods | Revert the notification-casing commit on block 4 (H-2) |
| An admin can't save anything | Likely H-3/H-4/H-5 transaction nesting — revert block 3 |
| Toast / modal infrastructure breaks | Revert block 5 in full, back to alert/confirm UX |

After any revert, re-run steps 2 and 4 (deploy + smoke).
