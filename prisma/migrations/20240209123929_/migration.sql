/*
  Warnings:

  - You are about to drop the column `activeated` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "activeated",
ADD COLUMN     "activated" BOOLEAN NOT NULL DEFAULT false;
