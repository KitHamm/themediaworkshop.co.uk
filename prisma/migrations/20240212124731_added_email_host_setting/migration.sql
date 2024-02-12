-- CreateTable
CREATE TABLE "emailHost" (
    "emailHost" TEXT NOT NULL DEFAULT 'kit@themediaworkshop.co.uk'
);

-- CreateIndex
CREATE UNIQUE INDEX "emailHost_emailHost_key" ON "emailHost"("emailHost");
