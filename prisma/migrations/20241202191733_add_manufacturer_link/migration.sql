-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "manufacturerLink" TEXT;

-- AlterTable
ALTER TABLE "_UserWishlist" ADD CONSTRAINT "_UserWishlist_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_UserWishlist_AB_unique";
