-- Add opt-in TOTP 2FA columns to "user".
-- All three columns are nullable / have a default, so existing rows stay valid.
-- totpSecret holds the base32 secret (set at /setup, kept until disable).
-- totpEnabled flips to true only after the user verifies their first code.
-- totpRecoveryCodes is a JSON array of bcrypt-hashed single-use codes.

ALTER TABLE "user" ADD COLUMN "totp_secret" TEXT;
ALTER TABLE "user" ADD COLUMN "totp_enabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user" ADD COLUMN "totp_recovery_codes" JSONB;
