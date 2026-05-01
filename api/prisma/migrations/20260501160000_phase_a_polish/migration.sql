-- Phase A senior-audit polish — 4 batches of zero-risk improvements.
--
-- 1. Rename Account.PartnerPayment → partnerPayments back-relation.
--    Schema-only; no SQL needed (Prisma uses model-side names for
--    implicit nesting, the underlying FK stays the same).
--
-- 2. Make AuditLog.user_agent text-typed so >255 char User-Agents
--    don't get truncated.
--
-- 3. Add created_at / updated_at to seven tables that were missing
--    them: account, segment, rental_tariff, car_counting_rule,
--    car_photo, reservation_add_on, rental_add_on. New columns are
--    NOT NULL with `now()` default so existing rows backfill instantly
--    to the migration timestamp.
--
-- 4. Add explicit ON DELETE rules to the 23 FKs that were on the
--    Postgres default (NO ACTION). Pure clarification — same runtime
--    behaviour for Restrict cases, slightly different for SetNull /
--    Cascade where we tightened. None of these changes break existing
--    rows because none of them depend on existing FK values.

-- ─── 2. AuditLog.user_agent → text ───────────────────────────────────────
ALTER TABLE audit_log ALTER COLUMN user_agent TYPE text;

-- ─── 3. created_at / updated_at on seven tables ─────────────────────────
ALTER TABLE account            ADD COLUMN updated_at TIMESTAMP(3) NOT NULL DEFAULT now();
ALTER TABLE segment            ADD COLUMN created_at TIMESTAMP(3) NOT NULL DEFAULT now();
ALTER TABLE segment            ADD COLUMN updated_at TIMESTAMP(3) NOT NULL DEFAULT now();
ALTER TABLE rental_tariff      ADD COLUMN created_at TIMESTAMP(3) NOT NULL DEFAULT now();
ALTER TABLE rental_tariff      ADD COLUMN updated_at TIMESTAMP(3) NOT NULL DEFAULT now();
ALTER TABLE car_counting_rule  ADD COLUMN created_at TIMESTAMP(3) NOT NULL DEFAULT now();
ALTER TABLE car_counting_rule  ADD COLUMN updated_at TIMESTAMP(3) NOT NULL DEFAULT now();
ALTER TABLE car_photo          ADD COLUMN created_at TIMESTAMP(3) NOT NULL DEFAULT now();
ALTER TABLE car_photo          ADD COLUMN updated_at TIMESTAMP(3) NOT NULL DEFAULT now();
ALTER TABLE reservation_add_on ADD COLUMN created_at TIMESTAMP(3) NOT NULL DEFAULT now();
ALTER TABLE reservation_add_on ADD COLUMN updated_at TIMESTAMP(3) NOT NULL DEFAULT now();
ALTER TABLE rental_add_on      ADD COLUMN created_at TIMESTAMP(3) NOT NULL DEFAULT now();
ALTER TABLE rental_add_on      ADD COLUMN updated_at TIMESTAMP(3) NOT NULL DEFAULT now();

-- ─── 4. Explicit ON DELETE on 23 FKs ─────────────────────────────────────
-- Pattern: drop the existing constraint (which had no explicit rule and
-- defaulted to NO ACTION), recreate it with the chosen rule. FK names
-- follow Postgres' default `<table>_<column>_fkey` pattern; Prisma's
-- earlier migrations created them with that exact form.

-- booking_request.client → SET NULL
ALTER TABLE booking_request DROP CONSTRAINT IF EXISTS booking_request_client_id_fkey;
ALTER TABLE booking_request ADD CONSTRAINT booking_request_client_id_fkey
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- rental_request.{client,booking_request,car,assigned_to_user} → SET NULL
ALTER TABLE rental_request DROP CONSTRAINT IF EXISTS rental_request_client_id_fkey;
ALTER TABLE rental_request ADD CONSTRAINT rental_request_client_id_fkey
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE rental_request DROP CONSTRAINT IF EXISTS rental_request_booking_request_id_fkey;
ALTER TABLE rental_request ADD CONSTRAINT rental_request_booking_request_id_fkey
    FOREIGN KEY (booking_request_id) REFERENCES booking_request(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE rental_request DROP CONSTRAINT IF EXISTS rental_request_car_id_fkey;
ALTER TABLE rental_request ADD CONSTRAINT rental_request_car_id_fkey
    FOREIGN KEY (car_id) REFERENCES car(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE rental_request DROP CONSTRAINT IF EXISTS rental_request_assigned_to_user_id_fkey;
ALTER TABLE rental_request ADD CONSTRAINT rental_request_assigned_to_user_id_fkey
    FOREIGN KEY (assigned_to_user_id) REFERENCES "user"(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- reservation.{rental_request,client,car,coverage_package}
ALTER TABLE reservation DROP CONSTRAINT IF EXISTS reservation_rental_request_id_fkey;
ALTER TABLE reservation ADD CONSTRAINT reservation_rental_request_id_fkey
    FOREIGN KEY (rental_request_id) REFERENCES rental_request(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE reservation DROP CONSTRAINT IF EXISTS reservation_client_id_fkey;
ALTER TABLE reservation ADD CONSTRAINT reservation_client_id_fkey
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE reservation DROP CONSTRAINT IF EXISTS reservation_car_id_fkey;
ALTER TABLE reservation ADD CONSTRAINT reservation_car_id_fkey
    FOREIGN KEY (car_id) REFERENCES car(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE reservation DROP CONSTRAINT IF EXISTS reservation_coverage_package_id_fkey;
ALTER TABLE reservation ADD CONSTRAINT reservation_coverage_package_id_fkey
    FOREIGN KEY (coverage_package_id) REFERENCES coverage_package(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- rental.{reservation,client,car}
ALTER TABLE rental DROP CONSTRAINT IF EXISTS rental_reservation_id_fkey;
ALTER TABLE rental ADD CONSTRAINT rental_reservation_id_fkey
    FOREIGN KEY (reservation_id) REFERENCES reservation(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE rental DROP CONSTRAINT IF EXISTS rental_client_id_fkey;
ALTER TABLE rental ADD CONSTRAINT rental_client_id_fkey
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE rental DROP CONSTRAINT IF EXISTS rental_car_id_fkey;
ALTER TABLE rental ADD CONSTRAINT rental_car_id_fkey
    FOREIGN KEY (car_id) REFERENCES car(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- inspection.inspector
ALTER TABLE inspection DROP CONSTRAINT IF EXISTS inspection_inspector_id_fkey;
ALTER TABLE inspection ADD CONSTRAINT inspection_inspector_id_fkey
    FOREIGN KEY (inspector_id) REFERENCES "user"(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- transaction.{account,client,reservation,rental,fine}
ALTER TABLE transaction DROP CONSTRAINT IF EXISTS transaction_account_id_fkey;
ALTER TABLE transaction ADD CONSTRAINT transaction_account_id_fkey
    FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE transaction DROP CONSTRAINT IF EXISTS transaction_client_id_fkey;
ALTER TABLE transaction ADD CONSTRAINT transaction_client_id_fkey
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE transaction DROP CONSTRAINT IF EXISTS transaction_reservation_id_fkey;
ALTER TABLE transaction ADD CONSTRAINT transaction_reservation_id_fkey
    FOREIGN KEY (reservation_id) REFERENCES reservation(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE transaction DROP CONSTRAINT IF EXISTS transaction_rental_id_fkey;
ALTER TABLE transaction ADD CONSTRAINT transaction_rental_id_fkey
    FOREIGN KEY (rental_id) REFERENCES rental(id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE transaction DROP CONSTRAINT IF EXISTS transaction_fine_id_fkey;
ALTER TABLE transaction ADD CONSTRAINT transaction_fine_id_fkey
    FOREIGN KEY (fine_id) REFERENCES fine(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- document.rental → CASCADE
ALTER TABLE document DROP CONSTRAINT IF EXISTS document_rental_id_fkey;
ALTER TABLE document ADD CONSTRAINT document_rental_id_fkey
    FOREIGN KEY (rental_id) REFERENCES rental(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- notification_log.template → RESTRICT
ALTER TABLE notification_log DROP CONSTRAINT IF EXISTS notification_log_template_id_fkey;
ALTER TABLE notification_log ADD CONSTRAINT notification_log_template_id_fkey
    FOREIGN KEY (template_id) REFERENCES notification_template(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- customer_account.client → CASCADE
ALTER TABLE customer_account DROP CONSTRAINT IF EXISTS customer_account_client_id_fkey;
ALTER TABLE customer_account ADD CONSTRAINT customer_account_client_id_fkey
    FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- partner_payment.account → RESTRICT
ALTER TABLE partner_payment DROP CONSTRAINT IF EXISTS partner_payment_account_id_fkey;
ALTER TABLE partner_payment ADD CONSTRAINT partner_payment_account_id_fkey
    FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE RESTRICT ON UPDATE CASCADE;

-- reservation_add_on.add_on, rental_add_on.add_on → RESTRICT
-- (catalog rows shouldn't go away while line items reference them)
ALTER TABLE reservation_add_on DROP CONSTRAINT IF EXISTS reservation_add_on_add_on_id_fkey;
ALTER TABLE reservation_add_on ADD CONSTRAINT reservation_add_on_add_on_id_fkey
    FOREIGN KEY (add_on_id) REFERENCES add_on(id) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE rental_add_on DROP CONSTRAINT IF EXISTS rental_add_on_add_on_id_fkey;
ALTER TABLE rental_add_on ADD CONSTRAINT rental_add_on_add_on_id_fkey
    FOREIGN KEY (add_on_id) REFERENCES add_on(id) ON DELETE RESTRICT ON UPDATE CASCADE;
