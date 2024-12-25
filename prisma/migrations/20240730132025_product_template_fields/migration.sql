/*
  Warnings:

  - You are about to drop the column `templateId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `fieldValue` on the `TemplateField` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `TemplateField` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_templateId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "templateId",
ADD COLUMN     "productTemplateId" TEXT;

-- AlterTable
ALTER TABLE "TemplateField" DROP COLUMN "fieldValue",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "ProductTemplate" (
    "id" TEXT NOT NULL,
    "templateId" TEXT,
    "fieldValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productTemplateId_fkey" FOREIGN KEY ("productTemplateId") REFERENCES "ProductTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTemplate" ADD CONSTRAINT "ProductTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;
