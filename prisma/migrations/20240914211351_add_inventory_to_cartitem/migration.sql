-- Step 1: Add the new inventoryId column as nullable initially
ALTER TABLE "CartItem" ADD COLUMN "inventoryId" TEXT;

-- Step 2: Update existing rows
-- This assumes there's a relationship between Product and Inventory
UPDATE "CartItem" c
SET "inventoryId" = i.id 
FROM "Inventory" i 
JOIN "Product" p ON i."productId" = p.id
WHERE p.id = c."productId";

-- Step 3: Handle any CartItems that couldn't be mapped to an Inventory
-- You might want to log these or handle them differently based on your business logic
DELETE FROM "CartItem"
WHERE "inventoryId" IS NULL;

-- Step 4: Make the inventoryId column required
ALTER TABLE "CartItem" ALTER COLUMN "inventoryId" SET NOT NULL;

-- Step 5: Add the foreign key constraint
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_inventoryId_fkey" 
FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE;

-- Step 6: Remove the old productId column and its constraint
ALTER TABLE "CartItem" DROP CONSTRAINT IF EXISTS "CartItem_productId_fkey";
ALTER TABLE "CartItem" DROP COLUMN "productId";