"use server";

import prisma from "@/lib/db";
import { UserRole } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export async function updateUserRole(userId: string, role: UserRole) {
  try {
    const authUser = await currentUser();
    if (!authUser) {
      return { success: false, error: "Unauthorized" };
    }

    const dbCaller = await prisma.user.findUnique({
      where: { clerkId: authUser.id },
      select: { role: true },
    });

    if (dbCaller?.role !== "ADMIN") {
      return { success: false, error: "Forbidden: You must be an ADMIN to modify roles." };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    
    // Refresh the settings page to show updated roles
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update role:", error);
    return { success: false, error: "Failed to update user role." };
  }
}
