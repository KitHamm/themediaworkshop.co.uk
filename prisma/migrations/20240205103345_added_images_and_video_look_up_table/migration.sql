-- CreateTable
CREATE TABLE "Images" (
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Videos" (
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Images_name_key" ON "Images"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Videos_name_key" ON "Videos"("name");
