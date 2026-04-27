-- ============================================================================
-- Migration: add_mail_models
-- Date:      2026-04-27
-- Purpose:   Generic mailbox at /admin/mail. IMAP+SMTP-backed inbox that lets
--            admins read/reply/send mail without leaving the panel. Designed
--            for one mailbox now (info@reiz.com.ua, Hostinger), extensible to
--            multiple accounts later.
--
-- Safety:   ALL changes are ADDITIVE — five brand-new tables, no other table
--           is touched.
--           - No DROP TABLE / DROP COLUMN
--           - No RENAME
--           - Cascading deletes scoped to mail-internal relations only.
--           - Credentials live in env vars (MAIL_USER / MAIL_PASSWORD), NOT
--             in mail_account — this migration adds no credential storage.
--
-- Rollback:
--   DROP TABLE "mail_draft";
--   DROP TABLE "mail_attachment";
--   DROP TABLE "mail_message";
--   DROP TABLE "mail_folder";
--   DROP TABLE "mail_account";
-- ============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. mail_account (one row per mailbox; bootstrapped from MAIL_* env vars)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "mail_account" (
    "id"           SERIAL       NOT NULL,
    "email"        TEXT         NOT NULL,
    "display_name" TEXT,
    "imap_host"    TEXT         NOT NULL,
    "imap_port"    INTEGER      NOT NULL DEFAULT 993,
    "imap_secure"  BOOLEAN      NOT NULL DEFAULT true,
    "smtp_host"    TEXT         NOT NULL,
    "smtp_port"    INTEGER      NOT NULL DEFAULT 465,
    "smtp_secure"  BOOLEAN      NOT NULL DEFAULT true,
    "username"     TEXT         NOT NULL,
    "signature"    TEXT,
    "is_active"    BOOLEAN      NOT NULL DEFAULT true,
    "last_sync_at" TIMESTAMP(3),
    "created_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mail_account_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "mail_account_email_key" ON "mail_account"("email");


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. mail_folder (IMAP folder mirror — Inbox/Sent/Drafts/Trash/Junk + custom)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "mail_folder" (
    "id"           SERIAL       NOT NULL,
    "account_id"   INTEGER      NOT NULL,
    "path"         TEXT         NOT NULL,
    "name"         TEXT         NOT NULL,
    "special_use"  TEXT,
    "uid_validity" TEXT,
    "uid_next"     TEXT,
    "unread_count" INTEGER      NOT NULL DEFAULT 0,
    "total_count"  INTEGER      NOT NULL DEFAULT 0,
    "last_sync_at" TIMESTAMP(3),
    "created_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mail_folder_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "mail_folder_account_id_path_key" ON "mail_folder"("account_id", "path");
CREATE INDEX "mail_folder_account_id_idx" ON "mail_folder"("account_id");

ALTER TABLE "mail_folder" ADD CONSTRAINT "mail_folder_account_id_fkey"
    FOREIGN KEY ("account_id") REFERENCES "mail_account"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. mail_message (envelope cache — body lazy-loaded from IMAP on first read)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "mail_message" (
    "id"              SERIAL       NOT NULL,
    "account_id"      INTEGER      NOT NULL,
    "folder_id"       INTEGER      NOT NULL,
    "uid"             INTEGER      NOT NULL,
    "message_id"      TEXT,
    "in_reply_to"     TEXT,
    "references"      TEXT,
    "thread_key"      TEXT,
    "from_name"       TEXT,
    "from_addr"       TEXT         NOT NULL,
    "to_addrs"        JSONB        NOT NULL,
    "cc_addrs"        JSONB,
    "bcc_addrs"       JSONB,
    "reply_to"        JSONB,
    "subject"         TEXT,
    "date"            TIMESTAMP(3) NOT NULL,
    "body_text"       TEXT,
    "body_html"       TEXT,
    "snippet"         TEXT,
    "has_attachments" BOOLEAN      NOT NULL DEFAULT false,
    "size"            INTEGER,
    "is_seen"         BOOLEAN      NOT NULL DEFAULT false,
    "is_flagged"      BOOLEAN      NOT NULL DEFAULT false,
    "is_answered"     BOOLEAN      NOT NULL DEFAULT false,
    "is_draft"        BOOLEAN      NOT NULL DEFAULT false,
    "flags"           JSONB,
    "created_at"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"      TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mail_message_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "mail_message_account_id_folder_id_uid_key"
    ON "mail_message"("account_id", "folder_id", "uid");
CREATE INDEX "mail_message_account_id_folder_id_date_idx"
    ON "mail_message"("account_id", "folder_id", "date");
CREATE INDEX "mail_message_thread_key_idx" ON "mail_message"("thread_key");
CREATE INDEX "mail_message_from_addr_idx" ON "mail_message"("from_addr");
CREATE INDEX "mail_message_is_seen_idx" ON "mail_message"("is_seen");

ALTER TABLE "mail_message" ADD CONSTRAINT "mail_message_account_id_fkey"
    FOREIGN KEY ("account_id") REFERENCES "mail_account"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mail_message" ADD CONSTRAINT "mail_message_folder_id_fkey"
    FOREIGN KEY ("folder_id") REFERENCES "mail_folder"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. mail_attachment (metadata only — binary fetched on-demand from IMAP)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "mail_attachment" (
    "id"           SERIAL       NOT NULL,
    "message_id"   INTEGER      NOT NULL,
    "filename"     TEXT,
    "content_type" TEXT,
    "size"         INTEGER,
    "content_id"   TEXT,
    "part_id"      TEXT,
    "storage_path" TEXT,
    "created_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mail_attachment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "mail_attachment_message_id_idx" ON "mail_attachment"("message_id");

ALTER TABLE "mail_attachment" ADD CONSTRAINT "mail_attachment_message_id_fkey"
    FOREIGN KEY ("message_id") REFERENCES "mail_message"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. mail_draft (composer auto-saves; not synced to IMAP Drafts folder)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE "mail_draft" (
    "id"             SERIAL       NOT NULL,
    "account_id"     INTEGER      NOT NULL,
    "to_addrs"       JSONB        NOT NULL,
    "cc_addrs"       JSONB,
    "bcc_addrs"      JSONB,
    "subject"        TEXT,
    "body_html"      TEXT,
    "body_text"      TEXT,
    "in_reply_to_id" INTEGER,
    "attachments"    JSONB,
    "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mail_draft_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "mail_draft_account_id_idx" ON "mail_draft"("account_id");

ALTER TABLE "mail_draft" ADD CONSTRAINT "mail_draft_account_id_fkey"
    FOREIGN KEY ("account_id") REFERENCES "mail_account"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
