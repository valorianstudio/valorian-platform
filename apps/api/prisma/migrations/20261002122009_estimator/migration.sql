-- CreateEnum
CREATE TYPE "PricingRuleKind" AS ENUM ('SCALE', 'URGENCY');

-- CreateEnum
CREATE TYPE "EstimatorCurrency" AS ENUM ('BDT', 'USD');

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "estimatorTypeId" TEXT;

-- CreateTable
CREATE TABLE "EstimatorSettings" (
    "id" TEXT NOT NULL DEFAULT 'estimator',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "currency" "EstimatorCurrency" NOT NULL DEFAULT 'BDT',
    "rangeLowPercent" INTEGER NOT NULL DEFAULT 10,
    "rangeHighPercent" INTEGER NOT NULL DEFAULT 10,
    "bothDiscountPercent" INTEGER NOT NULL DEFAULT 10,
    "roundingStep" INTEGER NOT NULL DEFAULT 1000,
    "disclaimer" TEXT NOT NULL DEFAULT 'Final pricing will be confirmed after detailed requirement analysis.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstimatorSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstimatorProjectType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "platform" "FeaturePlatform" NOT NULL DEFAULT 'WEBSITE',
    "basePrice" INTEGER NOT NULL DEFAULT 0,
    "baseWeeks" INTEGER NOT NULL DEFAULT 4,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstimatorProjectType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstimatorCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstimatorCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstimatorFeature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT,
    "websitePrice" INTEGER,
    "mobilePrice" INTEGER,
    "bothPrice" INTEGER,
    "effortDays" INTEGER NOT NULL DEFAULT 0,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "recommended" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstimatorFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstimatorIntegration" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "websitePrice" INTEGER,
    "mobilePrice" INTEGER,
    "bothPrice" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstimatorIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstimatorComplexity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "timelineFactor" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstimatorComplexity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstimatorPricingRule" (
    "id" TEXT NOT NULL,
    "kind" "PricingRuleKind" NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "timelineFactor" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstimatorPricingRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstimatorSubmission" (
    "id" TEXT NOT NULL,
    "projectTypeSlug" TEXT NOT NULL,
    "projectTypeName" TEXT NOT NULL,
    "demoSlug" TEXT,
    "industrySlug" TEXT,
    "platform" "FeaturePlatform" NOT NULL,
    "featureIds" TEXT[],
    "integrationIds" TEXT[],
    "complexity" TEXT NOT NULL,
    "scale" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "currency" "EstimatorCurrency" NOT NULL,
    "minAmount" INTEGER NOT NULL,
    "maxAmount" INTEGER NOT NULL,
    "weeksMin" INTEGER NOT NULL,
    "weeksMax" INTEGER NOT NULL,
    "breakdown" JSONB NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EstimatorSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DemoToEstimatorFeature" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DemoToEstimatorFeature_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EstimatorFeatureToIndustry" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EstimatorFeatureToIndustry_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "EstimatorProjectType_name_key" ON "EstimatorProjectType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EstimatorProjectType_slug_key" ON "EstimatorProjectType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EstimatorCategory_name_key" ON "EstimatorCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EstimatorCategory_slug_key" ON "EstimatorCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EstimatorFeature_name_key" ON "EstimatorFeature"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EstimatorFeature_slug_key" ON "EstimatorFeature"("slug");

-- CreateIndex
CREATE INDEX "EstimatorFeature_active_displayOrder_idx" ON "EstimatorFeature"("active", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "EstimatorIntegration_name_key" ON "EstimatorIntegration"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EstimatorIntegration_slug_key" ON "EstimatorIntegration"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EstimatorComplexity_name_key" ON "EstimatorComplexity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EstimatorComplexity_slug_key" ON "EstimatorComplexity"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EstimatorPricingRule_kind_key_key" ON "EstimatorPricingRule"("kind", "key");

-- CreateIndex
CREATE INDEX "EstimatorSubmission_createdAt_idx" ON "EstimatorSubmission"("createdAt");

-- CreateIndex
CREATE INDEX "_DemoToEstimatorFeature_B_index" ON "_DemoToEstimatorFeature"("B");

-- CreateIndex
CREATE INDEX "_EstimatorFeatureToIndustry_B_index" ON "_EstimatorFeatureToIndustry"("B");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_estimatorTypeId_fkey" FOREIGN KEY ("estimatorTypeId") REFERENCES "EstimatorProjectType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstimatorFeature" ADD CONSTRAINT "EstimatorFeature_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EstimatorCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DemoToEstimatorFeature" ADD CONSTRAINT "_DemoToEstimatorFeature_A_fkey" FOREIGN KEY ("A") REFERENCES "Demo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DemoToEstimatorFeature" ADD CONSTRAINT "_DemoToEstimatorFeature_B_fkey" FOREIGN KEY ("B") REFERENCES "EstimatorFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EstimatorFeatureToIndustry" ADD CONSTRAINT "_EstimatorFeatureToIndustry_A_fkey" FOREIGN KEY ("A") REFERENCES "EstimatorFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EstimatorFeatureToIndustry" ADD CONSTRAINT "_EstimatorFeatureToIndustry_B_fkey" FOREIGN KEY ("B") REFERENCES "Industry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
