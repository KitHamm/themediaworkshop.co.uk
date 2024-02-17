-- CreateTable
CREATE TABLE "Logos" (
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Logos_name_key" ON "Logos"("name");
