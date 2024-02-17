/*
  Warnings:

  - The `linkTo` column on the `Segment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "toLink" AS ENUM ('NONE', 'HOME', 'FILM', 'DIGITAL', 'LIGHT', 'EVENTS', 'ART');

-- AlterTable
ALTER TABLE "Segment" DROP COLUMN "linkTo",
ADD COLUMN     "linkTo" "toLink" NOT NULL DEFAULT 'NONE';
