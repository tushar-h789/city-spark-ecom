/*
  Warnings:

  - Changed the type of `type` on the `CartItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `OrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FulFillmentType" AS ENUM ('FOR_DELIVERY', 'FOR_COLLECTION');

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "type",
ADD COLUMN     "type" "FulFillmentType" NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "type",
ADD COLUMN     "type" "FulFillmentType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT;

-- DropEnum
DROP TYPE "ItemType";
