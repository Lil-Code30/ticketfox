import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import fs from "fs/promises";
import path from "path";
import type { FileType } from "@/generated/prisma/client";

// Determine FileType enum from MIME type
function getFileTypeFromMime(mime: string): FileType {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime === "application/pdf") return "PDF";
  if (mime.includes("wordprocessingml") || mime.includes("msword")) return "DOCX";
  if (mime === "text/plain") return "TXT";
  if (mime.includes("zip") || mime.includes("compressed")) return "ZIP";
  return "OTHER";
}

// Generate a unique filename to prevent collisions
function generateUniqueFileName(originalName: string): string {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const timestamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${slug}-${timestamp}-${rand}${ext}`;
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const authUser = await currentUser();
    let dbUserId: string | null = null;

    if (authUser) {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: authUser.id },
      });
      if (dbUser) dbUserId = dbUser.id;
    }

    // Parse multipart form data
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided." },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const createdFiles = [];

    for (const file of files) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        continue; // Skip files that are too large
      }

      const uniqueName = generateUniqueFileName(file.name);
      const storageKey = `uploads/${uniqueName}`;
      const filePath = path.join(uploadsDir, uniqueName);

      // Write file to disk
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      // Create DB record
      const dbFile = await prisma.file.create({
        data: {
          name: uniqueName,
          originalName: file.name,
          mimeType: file.type || "application/octet-stream",
          type: getFileTypeFromMime(file.type || ""),
          size: file.size,
          storageKey,
          url: `/${storageKey}`,
          uploadedById: dbUserId,
        },
      });

      createdFiles.push(dbFile);
    }

    return NextResponse.json({ success: true, data: createdFiles });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload files." },
      { status: 500 }
    );
  }
}
