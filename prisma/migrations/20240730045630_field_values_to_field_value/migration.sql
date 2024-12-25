/*
  Warnings:

  - You are about to drop the column `fieldValues` on the `TemplateField` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TemplateField" DROP COLUMN "fieldValues",
ADD COLUMN     "fieldValue" TEXT;
