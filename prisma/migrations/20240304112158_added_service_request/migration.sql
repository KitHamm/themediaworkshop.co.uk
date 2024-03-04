-- CreateTable
CREATE TABLE "serviceRequest" (
    "id" TEXT NOT NULL,
    "page" TEXT,
    "response" INTEGER NOT NULL DEFAULT 200,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "serviceRequest_id_key" ON "serviceRequest"("id");
