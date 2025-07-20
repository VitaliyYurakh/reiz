-- CreateEnum
CREATE TYPE "CarPhotoType" AS ENUM ('MOBILE', 'PC');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "pass" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "plate_number" TEXT NOT NULL,
    "VIN" TEXT NOT NULL,
    "year_of_manufacture" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "preview_url" TEXT NOT NULL,
    "engine_volume" TEXT NOT NULL,
    "engine_type" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "fuel_consumption" TEXT NOT NULL,
    "drive_type" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "configuration" JSONB NOT NULL,
    "segment_id" INTEGER NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Segment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "overmileage_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalTariff" (
    "id" SERIAL NOT NULL,
    "deposit" INTEGER NOT NULL,
    "min_days" INTEGER NOT NULL,
    "max_days" INTEGER NOT NULL,
    "daily_price" INTEGER NOT NULL,
    "car_id" INTEGER NOT NULL,

    CONSTRAINT "RentalTariff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarCountingRule" (
    "id" SERIAL NOT NULL,
    "price_percent" INTEGER NOT NULL,
    "deposit_percent" INTEGER NOT NULL,
    "car_id" INTEGER NOT NULL,

    CONSTRAINT "CarCountingRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarPhoto" (
    "id" SERIAL NOT NULL,
    "type" "CarPhotoType" NOT NULL,
    "url" TEXT NOT NULL,
    "car_id" INTEGER NOT NULL,

    CONSTRAINT "CarPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "Segment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalTariff" ADD CONSTRAINT "RentalTariff_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarCountingRule" ADD CONSTRAINT "CarCountingRule_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarPhoto" ADD CONSTRAINT "CarPhoto_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
