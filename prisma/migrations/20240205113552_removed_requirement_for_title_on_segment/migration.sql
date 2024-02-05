-- DropIndex
DROP INDEX "Segment_title_key";

-- AlterTable
ALTER TABLE "Segment" ALTER COLUMN "title" DROP NOT NULL;
