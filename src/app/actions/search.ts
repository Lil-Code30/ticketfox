"use server";

import prisma from "@/lib/db";

interface SearchFilters {
  type?: string;
  categoryId?: string;
}

export async function searchKnowledge(query: string, filters?: SearchFilters) {
  try {
    if (!query.trim()) {
      return { success: true, data: [] };
    }

    const searchTerm = `%${query.trim()}%`;

    // Find knowledge entries where title, summary, or any block content matches
    // Using Prisma's built-in filtering with case-insensitive mode
    const knowledgeList = await prisma.knowledge.findMany({
      where: {
        AND: [
          // Apply type/category filters if provided
          ...(filters?.type && filters.type !== "ALL"
            ? [{ type: filters.type as any }]
            : []),
          ...(filters?.categoryId && filters.categoryId !== "ALL"
            ? [{ categoryId: filters.categoryId }]
            : []),
          // Search across title, summary, and block content
          {
            OR: [
              { title: { contains: query.trim(), mode: "insensitive" as const } },
              { summary: { contains: query.trim(), mode: "insensitive" as const } },
              {
                blocks: {
                  some: {
                    content: { contains: query.trim(), mode: "insensitive" as const },
                  },
                },
              },
              {
                tags: {
                  some: {
                    tag: {
                      name: { contains: query.trim(), mode: "insensitive" as const },
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        category: true,
        tags: {
          include: { tag: true },
        },
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });

    return { success: true, data: knowledgeList };
  } catch (error) {
    console.error("Failed to search knowledge:", error);
    return { success: false, error: "Failed to search knowledge base." };
  }
}
