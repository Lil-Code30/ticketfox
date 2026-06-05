"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { KnowledgeFilters } from "@/components/knowledge/knowledge-filters";
import { KnowledgeTable } from "@/components/knowledge/knowledge-table";
import { MOCK_KNOWLEDGE } from "@/lib/mock-data";
import type { Knowledge } from "@/types";

export default function KnowledgePage() {
  const [data, setData] = useState<Knowledge[]>(MOCK_KNOWLEDGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filter logic
  const filteredData = data.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === "ALL" || item.type === typeFilter;
    const matchesCategory = categoryFilter === "ALL" || item.categoryId === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  const handleDelete = () => {
    if (deleteTargetId) {
      setData((prev) => prev.filter((item) => item.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const handleDuplicate = (item: Knowledge) => {
    const duplicated: Knowledge = {
      ...item,
      id: `k-${Date.now()}`,
      title: `${item.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setData((prev) => [duplicated, ...prev]);
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

      {data.length === 0 ? (
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
          />

          <KnowledgeTable
            data={filteredData}
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
