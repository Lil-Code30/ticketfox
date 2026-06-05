-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TECHNICIAN', 'MANAGER', 'USER');

-- CreateEnum
CREATE TYPE "KnowledgeType" AS ENUM ('INCIDENT', 'DOCUMENTATION', 'RESOURCE', 'NOTE', 'CHECKLIST', 'SCRIPT');

-- CreateEnum
CREATE TYPE "KnowledgeStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('HEADING', 'PARAGRAPH', 'STEP', 'BULLET_LIST', 'NUMBERED_LIST', 'IMAGE', 'CODE', 'WARNING', 'CHECKLIST', 'QUOTE', 'FILE_REFERENCE');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMAGE', 'PDF', 'DOCX', 'TXT', 'ZIP', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Knowledge" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "type" "KnowledgeType" NOT NULL,
    "status" "KnowledgeStatus" NOT NULL DEFAULT 'PUBLISHED',
    "source" TEXT,
    "categoryId" TEXT,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Knowledge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL,
    "knowledgeId" TEXT NOT NULL,
    "type" "BlockType" NOT NULL,
    "order" INTEGER NOT NULL,
    "content" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeTag" (
    "knowledgeId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "KnowledgeTag_pkey" PRIMARY KEY ("knowledgeId","tagId")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "size" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeAttachment" (
    "id" TEXT NOT NULL,
    "knowledgeId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockAttachment" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeEmbedding" (
    "id" TEXT NOT NULL,
    "knowledgeId" TEXT NOT NULL,
    "embeddingId" TEXT,
    "model" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentConversation" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Knowledge_slug_key" ON "Knowledge"("slug");

-- CreateIndex
CREATE INDEX "Knowledge_type_idx" ON "Knowledge"("type");

-- CreateIndex
CREATE INDEX "Knowledge_status_idx" ON "Knowledge"("status");

-- CreateIndex
CREATE INDEX "Knowledge_categoryId_idx" ON "Knowledge"("categoryId");

-- CreateIndex
CREATE INDEX "Knowledge_authorId_idx" ON "Knowledge"("authorId");

-- CreateIndex
CREATE INDEX "Knowledge_title_idx" ON "Knowledge"("title");

-- CreateIndex
CREATE INDEX "Block_knowledgeId_idx" ON "Block"("knowledgeId");

-- CreateIndex
CREATE INDEX "Block_order_idx" ON "Block"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "File_uploadedById_idx" ON "File"("uploadedById");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeAttachment_knowledgeId_fileId_key" ON "KnowledgeAttachment"("knowledgeId", "fileId");

-- CreateIndex
CREATE UNIQUE INDEX "BlockAttachment_blockId_fileId_key" ON "BlockAttachment"("blockId", "fileId");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeEmbedding_knowledgeId_key" ON "KnowledgeEmbedding"("knowledgeId");

-- CreateIndex
CREATE INDEX "AgentMessage_conversationId_idx" ON "AgentMessage"("conversationId");

-- AddForeignKey
ALTER TABLE "Knowledge" ADD CONSTRAINT "Knowledge_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Knowledge" ADD CONSTRAINT "Knowledge_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_knowledgeId_fkey" FOREIGN KEY ("knowledgeId") REFERENCES "Knowledge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeTag" ADD CONSTRAINT "KnowledgeTag_knowledgeId_fkey" FOREIGN KEY ("knowledgeId") REFERENCES "Knowledge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeTag" ADD CONSTRAINT "KnowledgeTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeAttachment" ADD CONSTRAINT "KnowledgeAttachment_knowledgeId_fkey" FOREIGN KEY ("knowledgeId") REFERENCES "Knowledge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeAttachment" ADD CONSTRAINT "KnowledgeAttachment_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockAttachment" ADD CONSTRAINT "BlockAttachment_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockAttachment" ADD CONSTRAINT "BlockAttachment_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeEmbedding" ADD CONSTRAINT "KnowledgeEmbedding_knowledgeId_fkey" FOREIGN KEY ("knowledgeId") REFERENCES "Knowledge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentMessage" ADD CONSTRAINT "AgentMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AgentConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
