-- CreateTable
CREATE TABLE "ProductTemplateField" (
    "id" TEXT NOT NULL,
    "productTemplateId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductTemplateField_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductTemplateField" ADD CONSTRAINT "ProductTemplateField_productTemplateId_fkey" FOREIGN KEY ("productTemplateId") REFERENCES "ProductTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTemplateField" ADD CONSTRAINT "ProductTemplateField_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "TemplateField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
