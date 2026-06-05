// ──────────────────────────────────────────────
// Client-safe types mirroring Prisma schema
// Avoids importing @prisma/client in client components
// ──────────────────────────────────────────────

export type UserRole = "ADMIN" | "TECHNICIAN" | "MANAGER" | "USER";

export type KnowledgeType =
  | "INCIDENT"
  | "DOCUMENTATION"
  | "RESOURCE"
  | "NOTE"
  | "CHECKLIST"
  | "SCRIPT";

export type KnowledgeStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type BlockType =
  | "HEADING"
  | "PARAGRAPH"
  | "STEP"
  | "IMAGE"
  | "CODE"
  | "WARNING"
  | "CHECKLIST"
  | "QUOTE"
  | "FILE_REFERENCE";

export type FileType = "IMAGE" | "PDF" | "DOCX" | "TXT" | "ZIP" | "OTHER";

// ──────────────────────────────────────────────
// Entity interfaces
// ──────────────────────────────────────────────

export interface User {
  id: string;
  clerkId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: { knowledge: number };
}

export interface Tag {
  id: string;
  name: string;
  color: string | null;
  createdAt: Date;
  _count?: { knowledge: number };
}

export interface Block {
  id: string;
  knowledgeId: string;
  type: BlockType;
  order: number;
  content: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Knowledge {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  type: KnowledgeType;
  status: KnowledgeStatus;
  source: string | null;
  categoryId: string | null;
  authorId: string | null;
  createdAt: Date;
  updatedAt: Date;
  category?: Category | null;
  author?: User | null;
  blocks?: Block[];
  tags?: { tag: Tag }[];
}

export interface FileRecord {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  type: FileType;
  size: number;
  storageKey: string;
  url: string;
  uploadedById: string | null;
  createdAt: Date;
}

// ──────────────────────────────────────────────
// UI helpers
// ──────────────────────────────────────────────

export const KNOWLEDGE_TYPE_CONFIG: Record<
  KnowledgeType,
  { label: string; color: string }
> = {
  INCIDENT: { label: "Incident", color: "#ef4444" },
  DOCUMENTATION: { label: "Documentation", color: "#3b82f6" },
  RESOURCE: { label: "Resource", color: "#8b5cf6" },
  NOTE: { label: "Note", color: "#eab308" },
  CHECKLIST: { label: "Checklist", color: "#22c55e" },
  SCRIPT: { label: "Script", color: "#06b6d4" },
};

export const KNOWLEDGE_STATUS_CONFIG: Record<
  KnowledgeStatus,
  { label: string; color: string }
> = {
  DRAFT: { label: "Draft", color: "#6b7280" },
  PUBLISHED: { label: "Published", color: "#22c55e" },
  ARCHIVED: { label: "Archived", color: "#9ca3af" },
};

export const FILE_TYPE_CONFIG: Record<FileType, { label: string; color: string }> = {
  IMAGE: { label: "Image", color: "#8b5cf6" },
  PDF: { label: "PDF", color: "#ef4444" },
  DOCX: { label: "DOCX", color: "#3b82f6" },
  TXT: { label: "TXT", color: "#6b7280" },
  ZIP: { label: "ZIP", color: "#eab308" },
  OTHER: { label: "Other", color: "#9ca3af" },
};

export const TAG_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
];

export const CATEGORY_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];
