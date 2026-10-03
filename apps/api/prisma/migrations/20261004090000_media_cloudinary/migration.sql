-- Media assets can now live on Cloudinary: keep its public_id, folder and provider metadata.
ALTER TABLE "Media" ADD COLUMN "publicId" TEXT,
ADD COLUMN "folder" TEXT,
ADD COLUMN "metadata" JSONB;

CREATE UNIQUE INDEX "Media_publicId_key" ON "Media"("publicId");
CREATE INDEX "Media_storageProvider_idx" ON "Media"("storageProvider");
