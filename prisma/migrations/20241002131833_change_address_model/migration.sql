/*
  Warnings:

  - You are about to drop the column `postalCode` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Address` table. All the data in the column will be lost.
  - Added the required column `postcode` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "postalCode",
DROP COLUMN "state",
ADD COLUMN     "county" TEXT,
ADD COLUMN     "postcode" TEXT NOT NULL,
ALTER COLUMN "country" SET DEFAULT 'United Kingdom',
ALTER COLUMN "isDefaultBilling" DROP NOT NULL,
ALTER COLUMN "isDefaultShipping" DROP NOT NULL;
