-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "status" "Status";
