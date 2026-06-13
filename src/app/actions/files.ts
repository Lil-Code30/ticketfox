"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export async function getFiles() {
  try {
    const files = await prisma.file.findMany({
      include: {
        uploadedBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: files };
  } catch (error) {
    console.error("Failed to fetch files:", error);
    return { success: false, error: "Failed to fetch files." };
  }
}

export async function getFileById(id: string) {
  try {
    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return { success: true, data: file };
  } catch (error) {
    console.error("Failed to fetch file:", error);
    return { success: false, error: "Failed to fetch file." };
  }
}

export async function deleteFile(id: string) {
  try {
    // Get the file record first so we can delete from disk
    const file = await prisma.file.findUnique({ where: { id } });

    if (!file) {
      return { success: false, error: "File not found." };
    }

    // Delete the physical file from disk
    const filePath = path.join(process.cwd(), "public", file.storageKey);
    try {
      await fs.unlink(filePath);
    } catch (fsError) {
      // File may already be deleted from disk — continue with DB cleanup
      console.warn("File not found on disk, cleaning up DB record:", fsError);
    }

    // Delete the DB record (cascade will handle KnowledgeAttachment / BlockAttachment)
    await prisma.file.delete({ where: { id } });

    revalidatePath("/files");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete file:", error);
    return { success: false, error: "Failed to delete file." };
  }
}
