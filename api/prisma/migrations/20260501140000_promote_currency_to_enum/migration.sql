-- Promote `currency` from String to a Postgres ENUM in 13 columns.
-- Postgres now rejects any non-Currency value at INSERT/UPDATE time.
--
-- Pre-flight DB audit (2026-05-01) confirmed every existing row already
-- uses a value in the enum: UAH, USD, EUR are the only currencies in
-- production tables (account, transaction, daily_fx_rate, add_on,
-- rate_plan, rental_deposit, reservation deliveryCurrency). All other
-- tables are empty. The USING casts therefore cannot fail.
--
-- The enum carries 8 values: UAH/USD/EUR/ILS/PLN are user-facing
-- payment currencies (validators restrict to this subset), GBP/CZK/RON
-- are extra so fxRateService.getRate() can cache NBU rates for them
-- without runtime ENUM rejection. fxRateService.getRate accepts a
-- generic string and narrows via asCurrencyOrNull() — anything outside
-- the 8 returns null instead of crashing.

-- ─── Create ENUM type ────────────────────────────────────────────────────

CREATE TYPE "Currency" AS ENUM ('UAH', 'USD', 'EUR', 'ILS', 'PLN', 'GBP', 'CZK', 'RON');

-- ─── Convert columns ─────────────────────────────────────────────────────
-- Pattern per column: drop default → ALTER TYPE with USING cast → re-add typed default.

-- account.currency (default UAH)
ALTER TABLE account ALTER COLUMN currency DROP DEFAULT;
ALTER TABLE account ALTER COLUMN currency TYPE "Currency" USING currency::"Currency";
ALTER TABLE account ALTER COLUMN currency SET DEFAULT 'UAH'::"Currency";

-- transaction.currency (no default)
ALTER TABLE transaction ALTER COLUMN currency TYPE "Currency" USING currency::"Currency";

-- daily_fx_rate.currency (no default)
ALTER TABLE daily_fx_rate ALTER COLUMN currency TYPE "Currency" USING currency::"Currency";

-- add_on.currency (default USD)
ALTER TABLE add_on ALTER COLUMN currency DROP DEFAULT;
ALTER TABLE add_on ALTER COLUMN currency TYPE "Currency" USING currency::"Currency";
ALTER TABLE add_on ALTER COLUMN currency SET DEFAULT 'USD'::"Currency";

-- rate_plan.currency (default USD)
ALTER TABLE rate_plan ALTER COLUMN currency DROP DEFAULT;
ALTER TABLE rate_plan ALTER COLUMN currency TYPE "Currency" USING currency::"Currency";
ALTER TABLE rate_plan ALTER COLUMN currency SET DEFAULT 'USD'::"Currency";

-- rental_add_on.currency (default USD)
ALTER TABLE rental_add_on ALTER COLUMN currency DROP DEFAULT;
ALTER TABLE rental_add_on ALTER COLUMN currency TYPE "Currency" USING currency::"Currency";
ALTER TABLE rental_add_on ALTER COLUMN currency SET DEFAULT 'USD'::"Currency";

-- reservation_add_on.currency (default USD)
ALTER TABLE reservation_add_on ALTER COLUMN currency DROP DEFAULT;
ALTER TABLE reservation_add_on ALTER COLUMN currency TYPE "Currency" USING currency::"Currency";
ALTER TABLE reservation_add_on ALTER COLUMN currency SET DEFAULT 'USD'::"Currency";

-- rental_extension.currency (default USD)
ALTER TABLE rental_extension ALTER COLUMN currency DROP DEFAULT;
ALTER TABLE rental_extension ALTER COLUMN currency TYPE "Currency" USING currency::"Currency";
ALTER TABLE rental_extension ALTER COLUMN currency SET DEFAULT 'USD'::"Currency";

-- reservation.delivery_currency (default UAH)
ALTER TABLE reservation ALTER COLUMN delivery_currency DROP DEFAULT;
ALTER TABLE reservation ALTER COLUMN delivery_currency TYPE "Currency" USING delivery_currency::"Currency";
ALTER TABLE reservation ALTER COLUMN delivery_currency SET DEFAULT 'UAH'::"Currency";

-- rental.deposit_currency (default UAH)
ALTER TABLE rental ALTER COLUMN deposit_currency DROP DEFAULT;
ALTER TABLE rental ALTER COLUMN deposit_currency TYPE "Currency" USING deposit_currency::"Currency";
ALTER TABLE rental ALTER COLUMN deposit_currency SET DEFAULT 'UAH'::"Currency";

-- fine.currency (default UAH)
ALTER TABLE fine ALTER COLUMN currency DROP DEFAULT;
ALTER TABLE fine ALTER COLUMN currency TYPE "Currency" USING currency::"Currency";
ALTER TABLE fine ALTER COLUMN currency SET DEFAULT 'UAH'::"Currency";

-- service_event.currency (default UAH)
ALTER TABLE service_event ALTER COLUMN currency DROP DEFAULT;
ALTER TABLE service_event ALTER COLUMN currency TYPE "Currency" USING currency::"Currency";
ALTER TABLE service_event ALTER COLUMN currency SET DEFAULT 'UAH'::"Currency";

-- accident.currency (default UAH)
ALTER TABLE accident ALTER COLUMN currency DROP DEFAULT;
ALTER TABLE accident ALTER COLUMN currency TYPE "Currency" USING currency::"Currency";
ALTER TABLE accident ALTER COLUMN currency SET DEFAULT 'UAH'::"Currency";

-- inventory_item.currency (default UAH)
ALTER TABLE inventory_item ALTER COLUMN currency DROP DEFAULT;
ALTER TABLE inventory_item ALTER COLUMN currency TYPE "Currency" USING currency::"Currency";
ALTER TABLE inventory_item ALTER COLUMN currency SET DEFAULT 'UAH'::"Currency";

-- rental_deposit.currency (default UAH)
ALTER TABLE rental_deposit ALTER COLUMN currency DROP DEFAULT;
ALTER TABLE rental_deposit ALTER COLUMN currency TYPE "Currency" USING currency::"Currency";
ALTER TABLE rental_deposit ALTER COLUMN currency SET DEFAULT 'UAH'::"Currency";
