-- Backfill the missing CREATE TABLE for `lead` + `lead_email`. These
-- models were originally added via `prisma db push` (no migration file)
-- so on a fresh DB the next migration `20260501120000_promote_status_
-- columns_to_enums` would die with `relation "lead" does not exist`
-- when it tries to ALTER lead.status. The 2026-05-02 integration suite
-- caught this — see `feedback_jsonb_string_vs_object.md` story for
-- the discovery pattern.
--
-- Why this filename / position: timestamps put it strictly between
-- 20260501110000_lowercase_transaction_direction and the enum-promote
-- at 20260501120000. On prod this migration is marked applied via
-- `prisma migrate resolve --applied` (the tables already exist), so
-- it's a no-op there. On any new clean DB (CI integration tests, dev
-- env, restored backup) the tables get created with the correct
-- pre-enum shape (status as TEXT, direction as TEXT) so the next
-- migration's `ALTER COLUMN status TYPE "LeadStatus"` works.

-- ─── lead ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "lead" (
    id                   SERIAL       PRIMARY KEY,
    source               TEXT         NOT NULL DEFAULT 'google_places',
    google_place_id      TEXT,
    company_name         TEXT         NOT NULL,
    country              TEXT         NOT NULL,
    city                 TEXT         NOT NULL,
    website              TEXT,
    phone                TEXT,
    email                TEXT,
    owner_name           TEXT,
    language             TEXT         NOT NULL DEFAULT 'ru',
    -- TEXT for now; promoted to LeadStatus enum by the next migration
    -- (20260501120000_promote_status_columns_to_enums).
    status               TEXT         NOT NULL DEFAULT 'NEW',
    paused_reason        TEXT,
    website_content      TEXT,
    contacted_at         TIMESTAMP(3),
    last_follow_up_at    TIMESTAMP(3),
    follow_up_count      INTEGER      NOT NULL DEFAULT 0,
    replied_at           TIMESTAMP(3),
    assigned_manager_id  INTEGER,
    notes                TEXT,
    created_at           TIMESTAMP(3) NOT NULL DEFAULT now(),
    updated_at           TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT lead_google_place_id_key UNIQUE (google_place_id),
    CONSTRAINT lead_assigned_manager_id_fkey
        FOREIGN KEY (assigned_manager_id) REFERENCES "user"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS lead_status_idx              ON "lead"(status);
CREATE INDEX IF NOT EXISTS lead_country_idx             ON "lead"(country);
CREATE INDEX IF NOT EXISTS lead_assigned_manager_id_idx ON "lead"(assigned_manager_id);
CREATE INDEX IF NOT EXISTS lead_created_at_idx          ON "lead"(created_at);
CREATE INDEX IF NOT EXISTS lead_contacted_at_idx        ON "lead"(contacted_at);

-- ─── lead_email ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lead_email (
    id              SERIAL       PRIMARY KEY,
    lead_id         INTEGER      NOT NULL,
    -- TEXT for now; promoted to LeadEmailDirection enum by the next migration.
    direction       TEXT         NOT NULL,
    template        TEXT,
    subject         TEXT         NOT NULL,
    body            TEXT         NOT NULL,
    sent_at         TIMESTAMP(3),
    received_at     TIMESTAMP(3),
    gmail_msg_id    TEXT,
    gmail_thread_id TEXT,
    created_at      TIMESTAMP(3) NOT NULL DEFAULT now(),
    CONSTRAINT lead_email_gmail_msg_id_key UNIQUE (gmail_msg_id),
    CONSTRAINT lead_email_lead_id_fkey
        FOREIGN KEY (lead_id) REFERENCES "lead"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS lead_email_lead_id_idx         ON lead_email(lead_id);
CREATE INDEX IF NOT EXISTS lead_email_direction_idx       ON lead_email(direction);
CREATE INDEX IF NOT EXISTS lead_email_gmail_thread_id_idx ON lead_email(gmail_thread_id);
