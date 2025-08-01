/*
  Warnings:

  - A unique constraint covering the columns `[min_days,max_days,car_id]` on the table `RentalTariff` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RentalTariff_min_days_max_days_key";

-- CreateIndex
CREATE UNIQUE INDEX "RentalTariff_min_days_max_days_car_id_key" ON "RentalTariff"("min_days", "max_days", "car_id");
