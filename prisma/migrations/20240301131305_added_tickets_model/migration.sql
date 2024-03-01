-- CreateTable
CREATE TABLE "Ticekts" (
    "id" TEXT NOT NULL,
    "dashboard" BOOLEAN,
    "reproduclible" BOOLEAN,
    "description" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticekts_id_key" ON "Ticekts"("id");
