-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "deliveryEligibility" SET DEFAULT true,
ALTER COLUMN "collectionEligibility" SET DEFAULT true,
ALTER COLUMN "minDeliveryCount" SET DEFAULT 0,
ALTER COLUMN "minCollectionCount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "tradePrice" SET DEFAULT 0,
ALTER COLUMN "contractPrice" SET DEFAULT 0,
ALTER COLUMN "promotionalPrice" SET DEFAULT 0;
