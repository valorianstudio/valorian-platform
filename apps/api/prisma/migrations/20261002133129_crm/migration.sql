-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "LeadPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('ESTIMATOR', 'DEMO', 'SERVICE', 'CONTACT', 'HOMEPAGE', 'DIRECT', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('EMAIL', 'WHATSAPP', 'PHONE', 'VIDEO_CALL');

-- CreateEnum
CREATE TYPE "LostReason" AS ENUM ('PRICE', 'NO_RESPONSE', 'CHOSE_COMPETITOR', 'PROJECT_CANCELLED', 'REQUIREMENTS_CHANGED', 'OTHER');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CREATED', 'STATUS_CHANGED', 'PRIORITY_CHANGED', 'FOLLOW_UP', 'NOTE_ADDED', 'ESTIMATE', 'FINAL_VALUE', 'WON', 'LOST', 'ARCHIVED', 'CALL', 'WHATSAPP', 'EMAIL', 'MEETING', 'PROPOSAL_SENT', 'OTHER');

-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('PROJECT', 'GENERAL', 'PARTNERSHIP', 'SUPPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'REPLIED', 'CLOSED');

-- CreateTable
CREATE TABLE "LeadCounter" (
    "year" INTEGER NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LeadCounter_pkey" PRIMARY KEY ("year")
);

-- CreateTable
CREATE TABLE "LeadSettings" (
    "id" TEXT NOT NULL DEFAULT 'leads',
    "notifyEnabled" BOOLEAN NOT NULL DEFAULT false,
    "notifyEmail" TEXT,
    "responseNote" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "companyName" TEXT,
    "country" TEXT,
    "preferredContact" "ContactMethod" NOT NULL DEFAULT 'EMAIL',
    "source" "LeadSource" NOT NULL DEFAULT 'OTHER',
    "sourceUrl" TEXT,
    "projectType" TEXT,
    "platform" "FeaturePlatform",
    "demoId" TEXT,
    "serviceId" TEXT,
    "estimatorSubmissionId" TEXT,
    "estimatedMin" INTEGER,
    "estimatedMax" INTEGER,
    "currency" "EstimatorCurrency",
    "finalProjectValue" INTEGER,
    "finalCurrency" "EstimatorCurrency",
    "priority" "LeadPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "expectedTimeline" TEXT,
    "budgetRange" TEXT,
    "clientMessage" TEXT,
    "internalSummary" TEXT,
    "assignedTo" TEXT,
    "followUpAt" TIMESTAMP(3),
    "followUpNote" TEXT,
    "wonAt" TIMESTAMP(3),
    "lostAt" TIMESTAMP(3),
    "lostReason" "LostReason",
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadNote" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT,
    "authorName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadActivity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT,
    "authorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInquiry" (
    "id" TEXT NOT NULL,
    "type" "InquiryType" NOT NULL DEFAULT 'GENERAL',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "companyName" TEXT,
    "country" TEXT,
    "message" TEXT NOT NULL,
    "preferredContact" "ContactMethod" NOT NULL DEFAULT 'EMAIL',
    "sourceUrl" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "priority" "LeadPriority" NOT NULL DEFAULT 'NORMAL',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "internalNote" TEXT,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_referenceCode_key" ON "Lead"("referenceCode");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_estimatorSubmissionId_key" ON "Lead"("estimatorSubmissionId");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_priority_idx" ON "Lead"("priority");

-- CreateIndex
CREATE INDEX "Lead_source_idx" ON "Lead"("source");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_followUpAt_idx" ON "Lead"("followUpAt");

-- CreateIndex
CREATE INDEX "Lead_archivedAt_idx" ON "Lead"("archivedAt");

-- CreateIndex
CREATE INDEX "LeadNote_leadId_createdAt_idx" ON "LeadNote"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "LeadActivity_leadId_createdAt_idx" ON "LeadActivity"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "ContactInquiry_type_idx" ON "ContactInquiry"("type");

-- CreateIndex
CREATE INDEX "ContactInquiry_status_idx" ON "ContactInquiry"("status");

-- CreateIndex
CREATE INDEX "ContactInquiry_isRead_idx" ON "ContactInquiry"("isRead");

-- CreateIndex
CREATE INDEX "ContactInquiry_createdAt_idx" ON "ContactInquiry"("createdAt");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_demoId_fkey" FOREIGN KEY ("demoId") REFERENCES "Demo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_estimatorSubmissionId_fkey" FOREIGN KEY ("estimatorSubmissionId") REFERENCES "EstimatorSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
