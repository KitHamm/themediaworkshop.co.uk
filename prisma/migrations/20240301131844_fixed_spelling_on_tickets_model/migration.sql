/*
  Warnings:

  - You are about to drop the column `reproduclible` on the `Tickets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tickets" DROP COLUMN "reproduclible",
ADD COLUMN     "reproducible" BOOLEAN;
