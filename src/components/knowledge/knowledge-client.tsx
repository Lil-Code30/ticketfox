"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { KnowledgeFilters } from "@/components/knowledge/knowledge-filters";
import { KnowledgeTable } from "@/components/knowledge/knowledge-table";
import { createKnowledge, deleteKnowledge } from "@/app/actions/knowledge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function KnowledgeClient({ initialData, categories }: { initialData: any[], categories: any[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter logic
  const filteredData = initialData.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === "ALL" || item.type === typeFilter;
    const matchesCategory = categoryFilter === "ALL" || item.categoryId === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const handleDelete = async () => {
    if (deleteTargetId) {
      setLoading(true);
      try {
        const res = await deleteKnowledge(deleteTargetId);
        if (res.success) {
          toast.success("Entry deleted successfully.");
        } else {
          toast.error(res.error);
        }
      } catch (e) {
        toast.error("An unexpected error occurred.");
      } finally {
        setLoading(false);
        setDeleteTargetId(null);
      }
    }
  };

  const handleDuplicate = async (item: any) => {
    setLoading(true);
    try {
      const res = await createKnowledge({
        title: `${item.title} (Copy)`,
        summary: item.summary,
        type: item.type,
        status: "DRAFT", // Copies default to DRAFT
        categoryId: item.categoryId,
        tags: item.tags?.map((t: any) => t.tagId),
        // we won't duplicate blocks via this simple action just yet, or we could fetch full details.
        // For phase 1, a basic duplicate of metadata is fine, or we could use the getKnowledgeById to duplicate blocks.
        // We'll keep it simple: just duplicates the metadata for now.
      });
      if (res.success) {
        toast.success("Entry duplicated successfully.");
      } else {
        toast.error(res.error);
      }
    } catch (e) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Knowledge Base"
        description="Browse, search, and manage incidents, documentation, and resources."
        actions={
          <Link href="/knowledge/new" className={cn(buttonVariants({ variant: "default" }), "gap-2 bg-primary text-white hover:bg-primary-hover")}>
            <Plus size={16} />
            New Entry
          </Link>
        }
      />

      {initialData.length === 0 ? (
        <EmptyState
          title="Knowledge base is empty"
          description="Create your first entry to start building your internal knowledge base."
          actionLabel="New Entry"
          actionHref="/knowledge/new"
        />
      ) : (
        <div className="flex flex-col gap-4">
          <KnowledgeFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            categories={categories}
          />

          <KnowledgeTable
            data={filteredData as any}
            onDelete={(id) => setDeleteTargetId(id)}
            onDuplicate={handleDuplicate}
          />
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Delete Entry"
        description="Are you sure you want to delete this knowledge entry? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
