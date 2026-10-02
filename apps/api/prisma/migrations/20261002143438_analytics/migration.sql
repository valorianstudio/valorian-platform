-- CreateEnum
CREATE TYPE "AnalyticsEventType" AS ENUM ('PAGE_VIEW', 'DEMO_VIEW', 'DEMO_PLATFORM_SELECT', 'SERVICE_VIEW', 'SOLUTION_VIEW', 'CASE_STUDY_VIEW', 'ARTICLE_VIEW', 'ESTIMATOR_START', 'ESTIMATOR_STEP_COMPLETE', 'ESTIMATOR_COMPLETE', 'FEATURE_SELECT', 'INTEGRATION_SELECT', 'CTA_CLICK', 'WHATSAPP_CLICK', 'CONTACT_FORM_START', 'CONTACT_FORM_SUBMIT', 'LEAD_CREATED');

-- CreateEnum
CREATE TYPE "TrafficChannel" AS ENUM ('DIRECT', 'ORGANIC_SEARCH', 'SOCIAL', 'REFERRAL', 'PAID', 'UNKNOWN');

-- AlterTable
ALTER TABLE "EstimatorSubmission" ADD COLUMN     "sessionId" TEXT;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "sessionId" TEXT,
ADD COLUMN     "trafficChannel" "TrafficChannel",
ADD COLUMN     "utmCampaign" TEXT,
ADD COLUMN     "utmMedium" TEXT,
ADD COLUMN     "utmSource" TEXT;

-- CreateTable
CREATE TABLE "AnalyticsSession" (
    "id" TEXT NOT NULL,
    "channel" "TrafficChannel" NOT NULL DEFAULT 'UNKNOWN',
    "source" TEXT,
    "medium" TEXT,
    "campaign" TEXT,
    "content" TEXT,
    "term" TEXT,
    "referrerHost" TEXT,
    "landingPath" TEXT,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pageCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AnalyticsSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "type" "AnalyticsEventType" NOT NULL,
    "sessionId" TEXT NOT NULL,
    "path" TEXT,
    "demoId" TEXT,
    "serviceId" TEXT,
    "solutionId" TEXT,
    "caseStudyId" TEXT,
    "articleId" TEXT,
    "entityName" TEXT,
    "platform" TEXT,
    "featureId" TEXT,
    "estimatorSubmissionId" TEXT,
    "leadId" TEXT,
    "channel" "TrafficChannel",
    "source" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsSettings" (
    "id" TEXT NOT NULL DEFAULT 'analytics',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "retentionDays" INTEGER NOT NULL DEFAULT 180,
    "excludeAdmin" BOOLEAN NOT NULL DEFAULT true,
    "trackArticles" BOOLEAN NOT NULL DEFAULT true,
    "trackEstimator" BOOLEAN NOT NULL DEFAULT true,
    "defaultRangeDays" INTEGER NOT NULL DEFAULT 30,
    "idleLeadDays" INTEGER NOT NULL DEFAULT 14,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalyticsSession_firstSeenAt_idx" ON "AnalyticsSession"("firstSeenAt");

-- CreateIndex
CREATE INDEX "AnalyticsSession_channel_idx" ON "AnalyticsSession"("channel");

-- CreateIndex
CREATE INDEX "AnalyticsSession_lastSeenAt_idx" ON "AnalyticsSession"("lastSeenAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_type_createdAt_idx" ON "AnalyticsEvent"("type", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sessionId_idx" ON "AnalyticsEvent"("sessionId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_demoId_type_idx" ON "AnalyticsEvent"("demoId", "type");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_serviceId_type_idx" ON "AnalyticsEvent"("serviceId", "type");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_solutionId_type_idx" ON "AnalyticsEvent"("solutionId", "type");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_estimatorSubmissionId_idx" ON "AnalyticsEvent"("estimatorSubmissionId");

-- CreateIndex
CREATE INDEX "Lead_trafficChannel_idx" ON "Lead"("trafficChannel");
