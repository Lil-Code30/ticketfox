"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TagForm } from "@/components/tags/tag-form";
import { createTag, updateTag, deleteTag } from "@/app/actions/tags";
import { toast } from "sonner";

type TagData = {
  id: string;
  name: string;
  color: string | null;
  createdAt: Date;
  _count?: { knowledge: number };
};

export function TagList({ initialData }: { initialData: TagData[] }) {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TagData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TagData | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = initialData.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: { name: string; color: string }) => {
    setLoading(true);
    try {
      if (editing) {
        const res = await updateTag(editing.id, data);
        if (res.success) toast.success("Tag updated successfully.");
        else toast.error(res.error);
      } else {
        const res = await createTag(data);
        if (res.success) toast.success("Tag created successfully.");
        else toast.error(res.error);
      }
    } catch (e) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
      setEditing(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      const res = await deleteTag(deleteTarget.id);
      if (res.success) toast.success("Tag deleted successfully.");
      else toast.error(res.error);
    } catch (e) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tags"
        description="Create and manage tags to further organize your knowledge base."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="gap-2 bg-primary text-white hover:bg-primary-hover"
            disabled={loading}
          >
            <Plus size={16} />
            New Tag
          </Button>
        }
      />

      {initialData.length === 0 ? (
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

          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  <th className="px-4 py-3 font-medium text-text-muted w-16">Color</th>
                  <th className="px-4 py-3 font-medium text-text-muted">Name</th>
                  <th className="px-4 py-3 text-right font-medium text-text-muted w-24">
                    Entries
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-text-muted w-28">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((tag) => (
                  <tr
                    key={tag.id}
                    className="transition-colors hover:bg-surface-2/50"
                  >
                    <td className="px-4 py-3">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: tag.color ?? "#6b7280" }}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-text">
                      {tag.name}
                    </td>
                    <td className="px-4 py-3 text-right text-text-muted">
                      {tag._count?.knowledge ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditing(tag);
                            setFormOpen(true);
                          }}
                          className="h-8 w-8 text-text-muted hover:text-text hover:bg-surface-2"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(tag)}
                          className="h-8 w-8 text-text-muted hover:text-red-500 hover:bg-surface-2"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-12 text-center text-sm text-text-muted"
                    >
                      No tags match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
