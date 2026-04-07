-- CreateTable
CREATE TABLE "car_city_availability" (
    "id" SERIAL NOT NULL,
    "car_id" INTEGER NOT NULL,
    "city_id" INTEGER NOT NULL,
    "delivery_fee" INTEGER NOT NULL DEFAULT 0,
    "min_rental_days" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "car_city_availability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "car_city_availability_city_id_is_active_idx" ON "car_city_availability"("city_id", "is_active");

-- CreateIndex
CREATE INDEX "car_city_availability_car_id_idx" ON "car_city_availability"("car_id");

-- CreateIndex
CREATE UNIQUE INDEX "car_city_availability_car_id_city_id_key" ON "car_city_availability"("car_id", "city_id");

-- AddForeignKey
ALTER TABLE "car_city_availability" ADD CONSTRAINT "car_city_availability_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_city_availability" ADD CONSTRAINT "car_city_availability_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE CASCADE ON UPDATE CASCADE;
