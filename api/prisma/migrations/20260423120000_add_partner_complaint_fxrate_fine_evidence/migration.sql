-- ============================================================================
-- Migration: add_partner_complaint_fxrate_fine_evidence
-- Date:      2026-04-23
-- Purpose:   Partner module (commission tracking), Complaint / ComplaintMessage
--            (customer disputes), DailyFxRate (NBU integration), Fine evidence
--            fields (legal defensibility).
--
-- Safety:   ALL changes are ADDITIVE.
--           - No DROP TABLE / DROP COLUMN
--           - No RENAME
--           - All new columns are NULLABLE or have DEFAULT → existing rows
--             remain valid without backfill.
--           - All new FKs are NULLABLE with ON DELETE SET NULL → no cascade
--             danger to Car / Client / Rental.
--
-- Affects existing data:
--   - "Car"          : + partner_id (NULL for all existing rows → own fleet)
--   - "fine"         : + 6 evidence columns (NULL / '[]' default)
--   - Photos, tariffs, counting rules, segments, clients, reservations,
--     rentals, transactions — untouched.
-- ============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Partner (new table)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "partner" (
    "id"               SERIAL            NOT NULL,
    "full_name"        TEXT              NOT NULL,
    "company_name"     TEXT,
    "edrpou"           TEXT,
    "ipn"              TEXT,
    "phone"            TEXT,
    "email"            TEXT,
    "iban"             TEXT,
    "bank_name"        TEXT,
    "commission_tiers" JSONB             NOT NULL DEFAULT '[{"minDays":1,"maxDays":7,"percent":15},{"minDays":8,"maxDays":29,"percent":12.5},{"minDays":30,"maxDays":0,"percent":10}]',
    "notes"            TEXT,
    "is_active"        BOOLEAN           NOT NULL DEFAULT true,
    "created_at"       TIMESTAMP(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"       TIMESTAMP(3)      NOT NULL,

    CONSTRAINT "partner_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "partner_is_active_idx" ON "partner"("is_active");


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Car.partner_id (nullable FK to partner)
--    Existing 13 cars on prod will get partner_id = NULL (own fleet).
--    Assign partners via admin UI after deploy.
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "Car" ADD COLUMN "partner_id" INTEGER;

ALTER TABLE "Car" ADD CONSTRAINT "Car_partner_id_fkey"
    FOREIGN KEY ("partner_id") REFERENCES "partner"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Car_partner_id_idx" ON "Car"("partner_id");


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Complaint (new table)
--    Canonical dispute/complaint/refund record. Replaces ad-hoc support email.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "complaint" (
    "id"                  SERIAL        NOT NULL,
    "ticket_number"       TEXT          NOT NULL,
    "client_id"           INTEGER,
    "rental_id"           INTEGER,
    "category"            TEXT          NOT NULL,
    "priority"            TEXT          NOT NULL DEFAULT 'normal',
    "status"              TEXT          NOT NULL DEFAULT 'open',
    "subject"             TEXT          NOT NULL,
    "initial_message"     TEXT          NOT NULL,
    "contact_name"        TEXT,
    "contact_email"       TEXT,
    "contact_phone"       TEXT,
    "attachments"         JSONB         NOT NULL DEFAULT '[]',
    "assigned_manager_id" INTEGER,
    "sla_deadline"        TIMESTAMP(3),
    "resolved_at"         TIMESTAMP(3),
    "resolution"          TEXT,
    "created_at"          TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"          TIMESTAMP(3)  NOT NULL,

    CONSTRAINT "complaint_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "complaint_ticket_number_key" ON "complaint"("ticket_number");
CREATE INDEX "complaint_status_idx"              ON "complaint"("status");
CREATE INDEX "complaint_category_idx"            ON "complaint"("category");
CREATE INDEX "complaint_client_id_idx"           ON "complaint"("client_id");
CREATE INDEX "complaint_rental_id_idx"           ON "complaint"("rental_id");
CREATE INDEX "complaint_assigned_manager_id_idx" ON "complaint"("assigned_manager_id");
CREATE INDEX "complaint_created_at_idx"          ON "complaint"("created_at");

ALTER TABLE "complaint" ADD CONSTRAINT "complaint_client_id_fkey"
    FOREIGN KEY ("client_id") REFERENCES "client"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "complaint" ADD CONSTRAINT "complaint_rental_id_fkey"
    FOREIGN KEY ("rental_id") REFERENCES "rental"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "complaint" ADD CONSTRAINT "complaint_assigned_manager_id_fkey"
    FOREIGN KEY ("assigned_manager_id") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. ComplaintMessage (thread messages; child of Complaint)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "complaint_message" (
    "id"             SERIAL        NOT NULL,
    "complaint_id"   INTEGER       NOT NULL,
    "author_type"    TEXT          NOT NULL,
    "author_user_id" INTEGER,
    "body"           TEXT          NOT NULL,
    "attachments"    JSONB         NOT NULL DEFAULT '[]',
    "created_at"     TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "complaint_message_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "complaint_message_complaint_id_idx" ON "complaint_message"("complaint_id");

ALTER TABLE "complaint_message" ADD CONSTRAINT "complaint_message_complaint_id_fkey"
    FOREIGN KEY ("complaint_id") REFERENCES "complaint"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "complaint_message" ADD CONSTRAINT "complaint_message_author_user_id_fkey"
    FOREIGN KEY ("author_user_id") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. DailyFxRate (new table — NBU cache)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "daily_fx_rate" (
    "id"         SERIAL        NOT NULL,
    "date"       DATE          NOT NULL,
    "currency"   TEXT          NOT NULL,
    "rate"       DOUBLE PRECISION NOT NULL,
    "source"     TEXT          NOT NULL DEFAULT 'NBU',
    "created_at" TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_fx_rate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "daily_fx_rate_date_currency_key" ON "daily_fx_rate"("date", "currency");
CREATE INDEX "daily_fx_rate_currency_date_idx"       ON "daily_fx_rate"("currency", "date");


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Fine evidence fields (legal defensibility for TRAFFIC/DAMAGE fines)
--    All nullable — no impact on existing rows (prod has 0 fines anyway).
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "fine" ADD COLUMN "external_case_number" TEXT;
ALTER TABLE "fine" ADD COLUMN "incident_at"          TIMESTAMP(3);
ALTER TABLE "fine" ADD COLUMN "location"             TEXT;
ALTER TABLE "fine" ADD COLUMN "authority"            TEXT;
ALTER TABLE "fine" ADD COLUMN "attachments"          JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "fine" ADD COLUMN "inspection_id"        INTEGER;

CREATE INDEX "fine_inspection_id_idx" ON "fine"("inspection_id");

ALTER TABLE "fine" ADD CONSTRAINT "fine_inspection_id_fkey"
    FOREIGN KEY ("inspection_id") REFERENCES "inspection"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;


-- ============================================================================
-- End of migration. No data was modified; only schema.
-- Rollback: drop the new tables + drop the new columns. No data loss.
-- ============================================================================
