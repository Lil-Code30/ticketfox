"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";
import { KnowledgeType, KnowledgeStatus, BlockType } from "@/generated/prisma/client";

// DTO for creating/updating blocks
export type BlockData = {
  type: BlockType;
  order: number;
  content?: string;
  metadata?: any;
};

export async function getKnowledgeList() {
  try {
    const knowledgeList = await prisma.knowledge.findMany({
      include: {
        category: true,
        tags: {
          include: { tag: true }
        },
        author: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    return { success: true, data: knowledgeList };
  } catch (error) {
    console.error("Failed to fetch knowledge list:", error);
    return { success: false, error: "Failed to fetch knowledge list." };
  }
}

export async function getKnowledgeById(id: string) {
  try {
    const knowledge = await prisma.knowledge.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: { tag: true }
        },
        blocks: {
          orderBy: { order: "asc" }
        },
        author: true,
      },
    });
    return { success: true, data: knowledge };
  } catch (error) {
    console.error("Failed to fetch knowledge:", error);
    return { success: false, error: "Failed to fetch knowledge." };
  }
}

export async function createKnowledge(data: {
  title: string;
  summary?: string;
  type: KnowledgeType;
  status: KnowledgeStatus;
  categoryId?: string;
  tags?: string[]; // array of tag IDs
  blocks?: BlockData[];
}) {
  try {
    const authUser = await currentUser();
    let dbUserId = undefined;

    if (authUser) {
      const dbUser = await prisma.user.findUnique({ where: { clerkId: authUser.id } });
      if (dbUser) dbUserId = dbUser.id;
    }

    // Generate a unique slug
    const baseSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const knowledge = await prisma.knowledge.create({
      data: {
        title: data.title,
        slug,
        summary: data.summary,
        type: data.type,
        status: data.status,
        categoryId: data.categoryId || null,
        authorId: dbUserId,
        
        // Create tags relationship
        ...(data.tags && data.tags.length > 0 && {
          tags: {
            create: data.tags.map(tagId => ({
              tag: { connect: { id: tagId } }
            }))
          }
        }),

        // Create blocks
        ...(data.blocks && data.blocks.length > 0 && {
          blocks: {
            create: data.blocks.map(block => ({
              type: block.type,
              order: block.order,
              content: block.content,
              metadata: block.metadata ? JSON.parse(JSON.stringify(block.metadata)) : undefined,
            }))
          }
        })
      },
    });
    
    revalidatePath("/knowledge");
    revalidatePath("/");
    return { success: true, data: knowledge };
  } catch (error) {
    console.error("Failed to create knowledge:", error);
    return { success: false, error: "Failed to create knowledge entry." };
  }
}

export async function updateKnowledge(
  id: string,
  data: {
    title: string;
    summary?: string;
    type: KnowledgeType;
    status: KnowledgeStatus;
    categoryId?: string;
    tags?: string[]; // array of tag IDs
    blocks?: BlockData[];
  }
) {
  try {
    // We update tags by deleting existing KnowledgeTag relations and creating new ones.
    // For blocks, we delete all existing and recreate them to ensure order/updates are perfect.
    
    // First, clear existing blocks and tags
    await prisma.$transaction([
      prisma.knowledgeTag.deleteMany({ where: { knowledgeId: id } }),
      prisma.block.deleteMany({ where: { knowledgeId: id } })
    ]);

    // Then update the knowledge entry with new relations
    const knowledge = await prisma.knowledge.update({
      where: { id },
      data: {
        title: data.title,
        summary: data.summary,
        type: data.type,
        status: data.status,
        categoryId: data.categoryId || null,

        // Create tags relationship
        ...(data.tags && data.tags.length > 0 && {
          tags: {
            create: data.tags.map(tagId => ({
              tag: { connect: { id: tagId } }
            }))
          }
        }),

        // Create blocks
        ...(data.blocks && data.blocks.length > 0 && {
          blocks: {
            create: data.blocks.map(block => ({
              type: block.type,
              order: block.order,
              content: block.content,
              metadata: block.metadata ? JSON.parse(JSON.stringify(block.metadata)) : undefined,
            }))
          }
        })
      },
    });

    revalidatePath("/knowledge");
    revalidatePath(`/knowledge/${id}`);
    revalidatePath("/");
    return { success: true, data: knowledge };
  } catch (error) {
    console.error("Failed to update knowledge:", error);
    return { success: false, error: "Failed to update knowledge entry." };
  }
}

export async function deleteKnowledge(id: string) {
  try {
    await prisma.knowledge.delete({
      where: { id },
    });
    revalidatePath("/knowledge");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete knowledge:", error);
    return { success: false, error: "Failed to delete knowledge entry." };
  }
}
