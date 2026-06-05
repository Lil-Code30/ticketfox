"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CategoryForm } from "@/components/categories/category-form";
import { MOCK_CATEGORIES } from "@/lib/mock-data";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data: { name: string; description: string; color: string }) => {
    if (editing) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? { ...c, name: data.name, description: data.description, color: data.color, updatedAt: new Date() }
            : c
        )
      );
      setEditing(null);
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: data.name,
        description: data.description,
        color: data.color,
        icon: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { knowledge: 0 },
      };
      setCategories((prev) => [newCat, ...prev]);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
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
          >
            <Plus size={16} />
            New Category
          </Button>
        }
      />

      {categories.length === 0 ? (
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
                  <th className="px-4 py-3 font-medium text-text-muted">Color</th>
                  <th className="px-4 py-3 font-medium text-text-muted">Name</th>
                  <th className="hidden px-4 py-3 font-medium text-text-muted md:table-cell">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-text-muted">
                    Entries
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-text-muted">
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
                            setEditing(cat);
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
        category={editing}
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
