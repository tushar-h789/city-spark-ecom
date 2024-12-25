/*
  Warnings:

  - You are about to drop the column `collectionTotalWithout` on the `Cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "collectionTotalWithout",
ADD COLUMN     "collectionTotalWithoutVat" DOUBLE PRECISION DEFAULT 0;
