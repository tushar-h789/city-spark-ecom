/*
  Warnings:

  - Added the required column `type` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('FOR_DELIVERY', 'FOR_COLLECTION');

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "type" "ItemType" NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "type" "ItemType" NOT NULL;
