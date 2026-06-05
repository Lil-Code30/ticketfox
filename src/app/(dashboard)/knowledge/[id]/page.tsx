"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { BlockRenderer } from "@/components/editor/block-renderer";
import { KNOWLEDGE_TYPE_CONFIG } from "@/types";
import type { Knowledge } from "@/types";
import { MOCK_KNOWLEDGE } from "@/lib/mock-data";

export default function KnowledgeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [item, setItem] = useState<Knowledge | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const found = MOCK_KNOWLEDGE.find((k) => k.id === id);
    if (found) setItem(found);
  }, [id]);

  const handleDelete = () => {
    // Simulate delete
    console.log("Deleted", id);
    router.push("/knowledge");
  };

  if (!item) {
    return <div className="py-12 text-center text-text-muted">Loading...</div>;
  }

  const typeConfig = KNOWLEDGE_TYPE_CONFIG[item.type];

  return (
    <div className="mx-auto flex max-w-[800px] flex-col gap-8 pb-12">
      <Button
        variant="ghost"
        className="w-fit gap-2 pl-0 text-text-muted hover:text-text hover:bg-transparent"
        onClick={() => router.back()}
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      <PageHeader
        title={item.title}
        description={item.summary || undefined}
        actions={
          <>
            <Link href={`/knowledge/${item.id}/edit`} className={cn(buttonVariants({ variant: "outline" }), "gap-2 border-border text-text hover:bg-surface-2")}>
              <Pencil size={16} />
              Edit
            </Link>
            <Button
              variant="outline"
              className="gap-2 border-border text-red-500 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-600"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-6">
        {/* Metadata Banner */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-border bg-surface px-5 py-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-text-faint">Type:</span>
            <span
              className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `${typeConfig.color}15`,
                color: typeConfig.color,
              }}
            >
              {typeConfig.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-faint">Category:</span>
            <span className="font-medium text-text">
              {item.category?.name || "Uncategorized"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-faint">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {item.tags?.map((t) => (
                <span
                  key={t.tag.id}
                  className="rounded border border-border px-1.5 py-0.5 text-[11px] text-text-muted"
                >
                  {t.tag.name}
                </span>
              ))}
              {(!item.tags || item.tags.length === 0) && (
                <span className="text-text">—</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-faint">Last updated:</span>
            <span className="text-text">{item.updatedAt.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Blocks Content (Read-Only) */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface px-6 py-8">
          {!item.blocks || item.blocks.length === 0 ? (
            <p className="text-center text-sm text-text-muted">
              This entry has no content.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {item.blocks
                .sort((a, b) => a.order - b.order)
                .map((block) => (
                  <div key={block.id} className="w-full">
                    <BlockRenderer
                      block={block}
                      onChange={() => {}}
                      readOnly={true}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Entry"
        description="Are you sure you want to delete this knowledge entry? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
