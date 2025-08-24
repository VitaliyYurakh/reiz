/*
  Warnings:

  - You are about to drop the column `segment_id` on the `Car` table. All the data in the column will be lost.
  - Added the required column `alt` to the `CarPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Car" DROP CONSTRAINT "Car_segment_id_fkey";

-- AlterTable
ALTER TABLE "public"."Car" DROP COLUMN "segment_id",
ADD COLUMN     "alt" TEXT NOT NULL DEFAULT 'image',
ADD COLUMN     "is_new" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."CarPhoto" ADD COLUMN     "alt" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Segment" ADD COLUMN     "driver_age" INTEGER NOT NULL DEFAULT 25,
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 3;

-- CreateTable
CREATE TABLE "public"."_CarToSegment" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CarToSegment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CarToSegment_B_index" ON "public"."_CarToSegment"("B");

-- AddForeignKey
ALTER TABLE "public"."_CarToSegment" ADD CONSTRAINT "_CarToSegment_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CarToSegment" ADD CONSTRAINT "_CarToSegment_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Segment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
