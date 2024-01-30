-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "position" TEXT,
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "short" TEXT,
    "description" TEXT,
    "video" TEXT
);

-- CreateTable
CREATE TABLE "Segment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "copy" TEXT,
    "image" TEXT[],
    "video" TEXT[],
    "headerimage" TEXT,
    "order" INTEGER,
    "pageId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "copy" TEXT NOT NULL,
    "image" TEXT[],
    "video" TEXT[],
    "segmentId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Page_id_key" ON "Page"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Page_title_key" ON "Page"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Segment_id_key" ON "Segment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Segment_title_key" ON "Segment"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_id_key" ON "CaseStudy"("id");

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "Segment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
