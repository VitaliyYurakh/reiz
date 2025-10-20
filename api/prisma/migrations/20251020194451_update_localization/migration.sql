/*
  Warnings:

  - The `engine_type` column on the `Car` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `transmission` column on the `Car` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `drive_type` column on the `Car` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "engine_type",
ADD COLUMN     "engine_type" JSONB,
DROP COLUMN "transmission",
ADD COLUMN     "transmission" JSONB,
DROP COLUMN "drive_type",
ADD COLUMN     "drive_type" JSONB;
