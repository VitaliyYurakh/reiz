-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "permissions" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
ALTER COLUMN "role" SET DEFAULT 'manager';

-- Ensure existing admin user keeps admin role and gets full name
UPDATE "User" SET "role" = 'admin', "name" = 'Administrator' WHERE "email" = 'admin@example.com';
