/*
  Warnings:

  - You are about to drop the `Ticekts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Ticekts";

-- CreateTable
CREATE TABLE "Tickets" (
    "id" TEXT NOT NULL,
    "dashboard" BOOLEAN,
    "reproduclible" BOOLEAN,
    "description" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Tickets_id_key" ON "Tickets"("id");
