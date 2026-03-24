-- AlterTable
ALTER TABLE "CarCountingRule" ADD COLUMN     "price_fixed" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updated_at" SET DEFAULT now();
