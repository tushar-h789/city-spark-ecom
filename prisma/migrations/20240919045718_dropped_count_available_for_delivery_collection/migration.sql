/*
  Warnings:

  - You are about to drop the column `countAvailableForCollection` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `countAvailableForDelivery` on the `Inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "countAvailableForCollection",
DROP COLUMN "countAvailableForDelivery";
