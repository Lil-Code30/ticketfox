"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TagForm } from "@/components/tags/tag-form";
import { MOCK_TAGS } from "@/lib/mock-data";
import type { Tag } from "@/types";

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>(MOCK_TAGS);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Tag | null>(null);

  const filtered = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data: { name: string; color: string }) => {
    if (editing) {
      setTags((prev) =>
        prev.map((t) =>
          t.id === editing.id ? { ...t, name: data.name, color: data.color } : t
        )
      );
      setEditing(null);
    } else {
      const newTag: Tag = {
        id: `tag-${Date.now()}`,
        name: data.name,
        color: data.color,
        createdAt: new Date(),
        _count: { knowledge: 0 },
      };
      setTags((prev) => [newTag, ...prev]);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setTags((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tags"
        description="Create and manage tags to label knowledge entries."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="gap-2 bg-primary text-white hover:bg-primary-hover"
          >
            <Plus size={16} />
            New Tag
          </Button>
        }
      />

      {tags.length === 0 ? (
        <EmptyState
          title="No tags found"
          description="Create your first tag to start labeling knowledge entries."
          actionLabel="New Tag"
          onAction={() => setFormOpen(true)}
        />
      ) : (
        <>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search tags..."
            className="max-w-sm"
          />

          <div className="flex flex-wrap gap-3">
            {filtered.map((tag) => (
              <div
                key={tag.id}
                className="group flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:bg-surface-2"
              >
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: tag.color ?? "#6b7280" }}
                />
                <span className="text-sm font-medium text-text">{tag.name}</span>
                <span className="text-xs text-text-faint">
                  {tag._count?.knowledge ?? 0}
                </span>
                <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(tag);
                      setFormOpen(true);
                    }}
                    className="h-6 w-6 text-text-muted hover:text-text hover:bg-surface-2"
                  >
                    <Pencil size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(tag)}
                    className="h-6 w-6 text-text-muted hover:text-red-500 hover:bg-surface-2"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="w-full py-12 text-center text-sm text-text-muted">
                No tags match your search.
              </p>
            )}
          </div>
        </>
      )}

      <TagForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        tag={editing}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Tag"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
