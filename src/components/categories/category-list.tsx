"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CategoryForm } from "@/components/categories/category-form";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions/categories";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Type based on Prisma returned category shape + _count
type CategoryData = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: { knowledge: number };
};

export function CategoryList({ initialData }: { initialData: CategoryData[] }) {
  const router = useRouter();
  // Using React state for optimistic UI or fast local search, though Server Actions trigger revalidation
  const [categories, setCategories] = useState<CategoryData[]>(initialData);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync state if server data changes
  // useEffect(() => { setCategories(initialData); }, [initialData]);
  // Actually, standard practice with Server Actions & revalidatePath is to just let the page reload,
  // but we'll use local state for immediate feedback until the server catches up, or just rely on the server data.
  // For simplicity and to avoid tearing, we'll map `initialData` but use it directly if we prefer.
  // Let's use `initialData` directly for rendering, to ensure it's always fresh after a mutation.

  const filtered = initialData.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: { name: string; description: string; color: string }) => {
    setLoading(true);
    try {
      if (editing) {
        const res = await updateCategory(editing.id, data);
        if (res.success) {
          toast.success("Category updated successfully.");
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createCategory(data);
        if (res.success) {
          toast.success("Category created successfully.");
        } else {
          toast.error(res.error);
        }
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
      const res = await deleteCategory(deleteTarget.id);
      if (res.success) {
        toast.success("Category deleted successfully.");
      } else {
        toast.error(res.error);
      }
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
        title="Categories"
        description="Organize your knowledge base into structured categories."
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
            New Category
          </Button>
        }
      />

      {initialData.length === 0 ? (
        <EmptyState
          title="No categories found"
          description="Create your first category to start organizing knowledge entries."
          actionLabel="New Category"
          onAction={() => setFormOpen(true)}
        />
      ) : (
        <>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search categories..."
            className="max-w-sm"
          />

          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  <th className="px-4 py-3 font-medium text-text-muted w-16">Color</th>
                  <th className="px-4 py-3 font-medium text-text-muted">Name</th>
                  <th className="hidden px-4 py-3 font-medium text-text-muted md:table-cell">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-text-muted w-24">
                    Entries
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-text-muted w-28">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((cat) => (
                  <tr
                    key={cat.id}
                    className="transition-colors hover:bg-surface-2/50"
                  >
                    <td className="px-4 py-3">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: cat.color ?? "#6b7280" }}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-text">
                      {cat.name}
                    </td>
                    <td className="hidden px-4 py-3 text-text-muted md:table-cell">
                      {cat.description || "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-text-muted">
                      {cat._count?.knowledge ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            // Map back to expected Category form shape if needed
                            setEditing(cat as any);
                            setFormOpen(true);
                          }}
                          className="h-8 w-8 text-text-muted hover:text-text hover:bg-surface-2"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(cat)}
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
                      colSpan={5}
                      className="px-4 py-12 text-center text-sm text-text-muted"
                    >
                      No categories match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <CategoryForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        category={editing as any}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
