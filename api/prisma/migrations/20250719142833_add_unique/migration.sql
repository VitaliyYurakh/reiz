/*
  Warnings:

  - A unique constraint covering the columns `[min_days,max_days]` on the table `RentalTariff` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RentalTariff_min_days_max_days_key" ON "RentalTariff"("min_days", "max_days");
