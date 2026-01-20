/*
  Warnings:

  - You are about to drop the column `total_cost` on the `BookingRequest` table. All the data in the column will be lost.
  - The `selected_plan` column on the `BookingRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BookingRequest" DROP COLUMN "total_cost",
ADD COLUMN     "price_breakdown" JSONB,
DROP COLUMN "selected_plan",
ADD COLUMN     "selected_plan" JSONB;
