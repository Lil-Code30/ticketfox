"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getTags() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { knowledge: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: tags };
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return { success: false, error: "Failed to fetch tags." };
  }
}

export async function createTag(data: { name: string; color?: string }) {
  try {
    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        color: data.color,
      },
    });
    revalidatePath("/tags");
    return { success: true, data: tag };
  } catch (error: any) {
    console.error("Failed to create tag:", error);
    if (error.code === "P2002") {
      return { success: false, error: "A tag with this name already exists." };
    }
    return { success: false, error: "Failed to create tag." };
  }
}

export async function updateTag(
  id: string,
  data: { name: string; color?: string }
) {
  try {
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name: data.name,
        color: data.color,
      },
    });
    revalidatePath("/tags");
    revalidatePath("/knowledge");
    return { success: true, data: tag };
  } catch (error: any) {
    console.error("Failed to update tag:", error);
    if (error.code === "P2002") {
      return { success: false, error: "A tag with this name already exists." };
    }
    return { success: false, error: "Failed to update tag." };
  }
}

export async function deleteTag(id: string) {
  try {
    await prisma.tag.delete({
      where: { id },
    });
    revalidatePath("/tags");
    revalidatePath("/knowledge");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete tag:", error);
    return { success: false, error: "Failed to delete tag." };
  }
}
