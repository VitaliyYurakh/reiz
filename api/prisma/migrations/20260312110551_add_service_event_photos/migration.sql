-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updated_at" SET DEFAULT now();

-- CreateTable
CREATE TABLE "service_event_photo" (
    "id" SERIAL NOT NULL,
    "service_event_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_event_photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_event_photo_service_event_id_idx" ON "service_event_photo"("service_event_id");

-- AddForeignKey
ALTER TABLE "service_event_photo" ADD CONSTRAINT "service_event_photo_service_event_id_fkey" FOREIGN KEY ("service_event_id") REFERENCES "service_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
