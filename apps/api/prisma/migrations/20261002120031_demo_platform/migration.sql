-- CreateEnum
CREATE TYPE "DemoLabel" AS ENUM ('INTERACTIVE_CONCEPT', 'PROTOTYPE', 'DEMO_PRODUCT', 'PRODUCTION_EXAMPLE');

-- CreateEnum
CREATE TYPE "PlatformType" AS ENUM ('WEBSITE', 'MOBILE');

-- CreateEnum
CREATE TYPE "FeaturePlatform" AS ENUM ('WEBSITE', 'MOBILE', 'BOTH');

-- CreateEnum
CREATE TYPE "ScreenshotKind" AS ENUM ('DESKTOP', 'TABLET', 'MOBILE', 'DASHBOARD', 'ADMIN', 'CUSTOMER', 'OTHER');

-- CreateEnum
CREATE TYPE "PointType" AS ENUM ('BENEFIT', 'USE_CASE');

-- CreateTable
CREATE TABLE "DemoCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Demo" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "internalName" TEXT,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL DEFAULT '',
    "categoryId" TEXT,
    "industryId" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "statusLabel" "DemoLabel" NOT NULL DEFAULT 'PROTOTYPE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "coverImageUrl" TEXT,
    "thumbnailUrl" TEXT,
    "badge" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "problem" TEXT,
    "solution" TEXT,
    "targetUsers" TEXT,
    "targetBusinesses" TEXT,
    "outcomes" TEXT[],
    "highlight" TEXT,
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "ogImageUrl" TEXT,
    "canonicalUrl" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Demo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoPlatform" (
    "id" TEXT NOT NULL,
    "demoId" TEXT NOT NULL,
    "type" "PlatformType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT,
    "description" TEXT,
    "demoUrl" TEXT,
    "videoUrl" TEXT,
    "ctaLabel" TEXT,
    "ctaUrl" TEXT,
    "notes" TEXT,
    "android" BOOLEAN NOT NULL DEFAULT false,
    "ios" BOOLEAN NOT NULL DEFAULT false,
    "playStoreUrl" TEXT,
    "appStoreUrl" TEXT,

    CONSTRAINT "DemoPlatform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoFeature" (
    "id" TEXT NOT NULL,
    "demoId" TEXT NOT NULL,
    "platform" "FeaturePlatform" NOT NULL DEFAULT 'BOTH',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DemoFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoModule" (
    "id" TEXT NOT NULL,
    "demoId" TEXT NOT NULL,
    "platform" "FeaturePlatform" NOT NULL DEFAULT 'BOTH',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DemoModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoScreenshot" (
    "id" TEXT NOT NULL,
    "demoId" TEXT NOT NULL,
    "platform" "PlatformType" NOT NULL DEFAULT 'WEBSITE',
    "kind" "ScreenshotKind" NOT NULL DEFAULT 'DESKTOP',
    "url" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "caption" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DemoScreenshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoPoint" (
    "id" TEXT NOT NULL,
    "demoId" TEXT NOT NULL,
    "type" "PointType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DemoPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RelatedDemos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RelatedDemos_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DemoPlatformTechnologies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DemoPlatformTechnologies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "DemoCategory_slug_key" ON "DemoCategory"("slug");

-- CreateIndex
CREATE INDEX "DemoCategory_active_displayOrder_idx" ON "DemoCategory"("active", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Demo_slug_key" ON "Demo"("slug");

-- CreateIndex
CREATE INDEX "Demo_status_active_featured_displayOrder_idx" ON "Demo"("status", "active", "featured", "displayOrder");

-- CreateIndex
CREATE INDEX "Demo_categoryId_idx" ON "Demo"("categoryId");

-- CreateIndex
CREATE INDEX "Demo_industryId_idx" ON "Demo"("industryId");

-- CreateIndex
CREATE UNIQUE INDEX "DemoPlatform_demoId_type_key" ON "DemoPlatform"("demoId", "type");

-- CreateIndex
CREATE INDEX "DemoFeature_demoId_displayOrder_idx" ON "DemoFeature"("demoId", "displayOrder");

-- CreateIndex
CREATE INDEX "DemoModule_demoId_displayOrder_idx" ON "DemoModule"("demoId", "displayOrder");

-- CreateIndex
CREATE INDEX "DemoScreenshot_demoId_displayOrder_idx" ON "DemoScreenshot"("demoId", "displayOrder");

-- CreateIndex
CREATE INDEX "DemoPoint_demoId_type_displayOrder_idx" ON "DemoPoint"("demoId", "type", "displayOrder");

-- CreateIndex
CREATE INDEX "_RelatedDemos_B_index" ON "_RelatedDemos"("B");

-- CreateIndex
CREATE INDEX "_DemoPlatformTechnologies_B_index" ON "_DemoPlatformTechnologies"("B");

-- AddForeignKey
ALTER TABLE "Demo" ADD CONSTRAINT "Demo_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "DemoCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Demo" ADD CONSTRAINT "Demo_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoPlatform" ADD CONSTRAINT "DemoPlatform_demoId_fkey" FOREIGN KEY ("demoId") REFERENCES "Demo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoFeature" ADD CONSTRAINT "DemoFeature_demoId_fkey" FOREIGN KEY ("demoId") REFERENCES "Demo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoModule" ADD CONSTRAINT "DemoModule_demoId_fkey" FOREIGN KEY ("demoId") REFERENCES "Demo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoScreenshot" ADD CONSTRAINT "DemoScreenshot_demoId_fkey" FOREIGN KEY ("demoId") REFERENCES "Demo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoPoint" ADD CONSTRAINT "DemoPoint_demoId_fkey" FOREIGN KEY ("demoId") REFERENCES "Demo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelatedDemos" ADD CONSTRAINT "_RelatedDemos_A_fkey" FOREIGN KEY ("A") REFERENCES "Demo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelatedDemos" ADD CONSTRAINT "_RelatedDemos_B_fkey" FOREIGN KEY ("B") REFERENCES "Demo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DemoPlatformTechnologies" ADD CONSTRAINT "_DemoPlatformTechnologies_A_fkey" FOREIGN KEY ("A") REFERENCES "DemoPlatform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DemoPlatformTechnologies" ADD CONSTRAINT "_DemoPlatformTechnologies_B_fkey" FOREIGN KEY ("B") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
