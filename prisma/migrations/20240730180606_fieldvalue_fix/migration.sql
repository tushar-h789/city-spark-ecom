/*
  Warnings:

  - You are about to drop the column `fieldValue` on the `ProductTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductTemplate" DROP COLUMN "fieldValue";

-- AlterTable
ALTER TABLE "ProductTemplateField" ADD COLUMN     "fieldValue" TEXT;
