-- CreateTable
CREATE TABLE "city" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name_uk" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_locative_uk" TEXT NOT NULL,
    "name_locative_ru" TEXT NOT NULL,
    "name_locative_en" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pickup_location" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "name_uk" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pickup_location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "city_slug_key" ON "city"("slug");

-- CreateIndex
CREATE INDEX "city_is_active_idx" ON "city"("is_active");

-- CreateIndex
CREATE INDEX "pickup_location_city_id_idx" ON "pickup_location"("city_id");

-- CreateIndex
CREATE UNIQUE INDEX "pickup_location_city_id_slug_key" ON "pickup_location"("city_id", "slug");

-- AddForeignKey
ALTER TABLE "pickup_location" ADD CONSTRAINT "pickup_location_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE CASCADE ON UPDATE CASCADE;
