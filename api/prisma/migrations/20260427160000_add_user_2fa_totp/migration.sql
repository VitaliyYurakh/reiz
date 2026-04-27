-- Add opt-in TOTP 2FA columns to "User".
-- All three columns are nullable / have a default, so existing rows stay valid.
-- totpSecret holds the base32 secret (set at /setup, kept until disable).
-- totpEnabled flips to true only after the user verifies their first code.
-- totpRecoveryCodes is a JSON array of bcrypt-hashed single-use codes.
--
-- Note: the User table is "User" (PascalCase, no @@map). Earlier draft used
-- lowercase "user" which failed on prod; columns were eventually synced via
-- the api container's `prisma db push --accept-data-loss` fallback step.
-- The failed migration entry was resolved with `prisma migrate resolve --applied`.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totp_secret" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totp_enabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "totp_recovery_codes" JSONB;
