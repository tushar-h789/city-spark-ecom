/*
  Warnings:

  - You are about to drop the column `fieldId` on the `ProductTemplateField` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Template` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `templateFieldId` to the `ProductTemplateField` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductTemplateField" DROP CONSTRAINT "ProductTemplateField_fieldId_fkey";

-- AlterTable
ALTER TABLE "ProductTemplateField" DROP COLUMN "fieldId",
ADD COLUMN     "templateFieldId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Template_name_key" ON "Template"("name");

-- AddForeignKey
ALTER TABLE "ProductTemplateField" ADD CONSTRAINT "ProductTemplateField_templateFieldId_fkey" FOREIGN KEY ("templateFieldId") REFERENCES "TemplateField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
