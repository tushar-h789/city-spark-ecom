-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "heldCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "soldCount" INTEGER NOT NULL DEFAULT 0;
