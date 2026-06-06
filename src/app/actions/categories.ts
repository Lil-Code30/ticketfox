"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { knowledge: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { success: false, error: "Failed to fetch categories." };
  }
}

export async function createCategory(data: {
  name: string;
  description?: string;
  color?: string;
}) {
  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
      },
    });
    revalidatePath("/categories");
    return { success: true, data: category };
  } catch (error: any) {
    console.error("Failed to create category:", error);
    if (error.code === "P2002") {
      return { success: false, error: "A category with this name already exists." };
    }
    return { success: false, error: "Failed to create category." };
  }
}

export async function updateCategory(
  id: string,
  data: {
    name: string;
    description?: string;
    color?: string;
  }
) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
      },
    });
    revalidatePath("/categories");
    revalidatePath("/knowledge");
    return { success: true, data: category };
  } catch (error: any) {
    console.error("Failed to update category:", error);
    if (error.code === "P2002") {
      return { success: false, error: "A category with this name already exists." };
    }
    return { success: false, error: "Failed to update category." };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/categories");
    revalidatePath("/knowledge");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "Failed to delete category." };
  }
}
