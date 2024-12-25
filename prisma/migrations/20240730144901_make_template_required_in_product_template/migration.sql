/*
  Warnings:

  - Made the column `templateId` on table `ProductTemplate` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ProductTemplate" DROP CONSTRAINT "ProductTemplate_templateId_fkey";

-- AlterTable
ALTER TABLE "ProductTemplate" ALTER COLUMN "templateId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductTemplate" ADD CONSTRAINT "ProductTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
