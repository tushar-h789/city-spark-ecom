/*
  Warnings:

  - You are about to drop the column `collectionTotal` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryTotal` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `subTotal` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "collectionTotal",
DROP COLUMN "deliveryTotal",
DROP COLUMN "subTotal",
DROP COLUMN "tax",
DROP COLUMN "totalPrice",
ADD COLUMN     "collectionTotalWithVat" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "collectionTotalWithout" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "deliveryTotalWithVat" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "deliveryTotalWithoutVat" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "subTotalWithVat" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "subTotalWithoutVat" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "totalPriceWithVat" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "totalPriceWithoutVat" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "vat" DOUBLE PRECISION DEFAULT 0;
