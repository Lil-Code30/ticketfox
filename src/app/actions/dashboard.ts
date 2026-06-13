"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { KnowledgeType, KnowledgeStatus } from "@/generated/prisma/client";

export async function getDashboardMetrics() {
  try {
    // Counts
    const totalEntries = await prisma.knowledge.count();
    const incidents = await prisma.knowledge.count({ where: { type: "INCIDENT" } });
    const documentation = await prisma.knowledge.count({ where: { type: "DOCUMENTATION" } });
    const resources = await prisma.knowledge.count({ where: { type: "RESOURCE" } });
    const notes = await prisma.knowledge.count({ where: { type: "NOTE" } });
    const scripts = await prisma.knowledge.count({ where: { type: "SCRIPT" } });

    // Recent Activity
    const recentActivity = await prisma.knowledge.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
        category: {
          select: { name: true }
        },
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      success: true,
      data: {
        counts: {
          totalEntries,
          incidents,
          documentation,
          resources,
          notes,
          scripts,
        },
        recentActivity: recentActivity.map((r) => ({
          ...r,
          authorName: r.author?.firstName 
            ? `${r.author.firstName} ${r.author.lastName || ""}`.trim() 
            : "System",
        })),
      },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard metrics:", error);
    return { success: false, error: "Failed to fetch dashboard metrics." };
  }
}
