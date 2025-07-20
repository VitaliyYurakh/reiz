-- DropForeignKey
ALTER TABLE "CarCountingRule" DROP CONSTRAINT "CarCountingRule_car_id_fkey";

-- DropForeignKey
ALTER TABLE "RentalTariff" DROP CONSTRAINT "RentalTariff_car_id_fkey";

-- AddForeignKey
ALTER TABLE "RentalTariff" ADD CONSTRAINT "RentalTariff_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarCountingRule" ADD CONSTRAINT "CarCountingRule_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
