-- Add StoreMode enum
CREATE TYPE "StoreMode" AS ENUM ('PHYSICAL', 'ONLINE', 'HYBRID');

-- Add TestimonialStatus enum
CREATE TYPE "TestimonialStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Add SHOE_MARKET to Vertical enum
ALTER TYPE "Vertical" ADD VALUE 'SHOE_MARKET';

-- Add store presence columns to Store
ALTER TABLE "Store" ADD COLUMN "description" TEXT;
ALTER TABLE "Store" ADD COLUMN "primaryMode" "StoreMode" NOT NULL DEFAULT 'ONLINE';
ALTER TABLE "Store" ADD COLUMN "address" TEXT;
ALTER TABLE "Store" ADD COLUMN "city" TEXT;
ALTER TABLE "Store" ADD COLUMN "openingHours" TEXT;
ALTER TABLE "Store" ADD COLUMN "phone" TEXT;
ALTER TABLE "Store" ADD COLUMN "email" TEXT;
ALTER TABLE "Store" ADD COLUMN "mapLat" DOUBLE PRECISION;
ALTER TABLE "Store" ADD COLUMN "mapLng" DOUBLE PRECISION;
ALTER TABLE "Store" ADD COLUMN "metadata" JSONB;

-- Add auth columns to Customer
ALTER TABLE "Customer" ADD COLUMN "passwordHash" TEXT;
ALTER TABLE "Customer" ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable GalleryImage
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable Testimonial
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "status" "TestimonialStatus" NOT NULL DEFAULT 'PENDING',
    "locale" TEXT,
    "adminReply" TEXT,
    "customerId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable LegalConfig
CREATE TABLE "LegalConfig" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "companyName" TEXT NOT NULL DEFAULT '',
    "street" TEXT NOT NULL DEFAULT '',
    "zip" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT 'Deutschland',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "vatId" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GalleryImage_storeId_sortOrder_idx" ON "GalleryImage"("storeId", "sortOrder");

-- CreateIndex
CREATE INDEX "Testimonial_storeId_status_idx" ON "Testimonial"("storeId", "status");

-- CreateIndex
CREATE INDEX "Testimonial_storeId_createdAt_idx" ON "Testimonial"("storeId", "createdAt");

-- CreateIndex
CREATE INDEX "Testimonial_customerId_idx" ON "Testimonial"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "LegalConfig_storeId_key" ON "LegalConfig"("storeId");

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalConfig" ADD CONSTRAINT "LegalConfig_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
