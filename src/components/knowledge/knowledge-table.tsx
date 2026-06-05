"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Knowledge } from "@/types";
import { KNOWLEDGE_TYPE_CONFIG } from "@/types";
import { cn } from "@/lib/utils";

interface KnowledgeTableProps {
  data: Knowledge[];
  onDelete: (id: string) => void;
  onDuplicate: (item: Knowledge) => void;
}

export function KnowledgeTable({
  data,
  onDelete,
  onDuplicate,
}: KnowledgeTableProps) {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-text-muted border rounded-xl border-border">
        No knowledge entries match your filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-2">
            <th className="px-4 py-3 font-medium text-text-muted">Title</th>
            <th className="px-4 py-3 font-medium text-text-muted">Type</th>
            <th className="hidden px-4 py-3 font-medium text-text-muted md:table-cell">
              Category
            </th>
            <th className="hidden px-4 py-3 font-medium text-text-muted lg:table-cell">
              Tags
            </th>
            <th className="hidden px-4 py-3 font-medium text-text-muted md:table-cell">
              Updated
            </th>
            <th className="px-4 py-3 text-right font-medium text-text-muted">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item) => {
            const typeConfig = KNOWLEDGE_TYPE_CONFIG[item.type];

            return (
              <tr
                key={item.id}
                className="transition-colors hover:bg-surface-2/50 group"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/knowledge/${item.id}`}
                    className="font-medium text-text hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: `${typeConfig.color}15`,
                      color: typeConfig.color,
                    }}
                  >
                    {typeConfig.label}
                  </span>
                </td>
                <td className="hidden px-4 py-3 md:table-cell text-text-muted">
                  <div className="flex items-center gap-2">
                    {item.category && (
                      <>
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: item.category.color ?? "#6b7280" }}
                        />
                        <span className="line-clamp-1">{item.category.name}</span>
                      </>
                    )}
                    {!item.category && "—"}
                  </div>
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {item.tags?.slice(0, 2).map((t) => (
                      <span
                        key={t.tag.id}
                        className="inline-block rounded border border-border px-1.5 py-0.5 text-[11px] text-text-muted line-clamp-1 max-w-[100px]"
                      >
                        {t.tag.name}
                      </span>
                    ))}
                    {(item.tags?.length || 0) > 2 && (
                      <span className="inline-block rounded border border-border px-1.5 py-0.5 text-[11px] text-text-muted">
                        +{(item.tags?.length || 0) - 2}
                      </span>
                    )}
                    {(!item.tags || item.tags.length === 0) && (
                      <span className="text-text-faint">—</span>
                    )}
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-text-muted md:table-cell whitespace-nowrap">
                  {item.updatedAt.toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-surface-2 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <MoreHorizontal size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-border bg-surface w-40">
                      <DropdownMenuItem onClick={() => window.location.href = `/knowledge/${item.id}/edit`} className="cursor-pointer text-text hover:bg-surface-2 focus:bg-surface-2 flex items-center gap-2">
                        <Pencil size={14} className="text-text-muted" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDuplicate(item)}
                        className="cursor-pointer text-text hover:bg-surface-2 focus:bg-surface-2 flex items-center gap-2"
                      >
                        <Copy size={14} className="text-text-muted" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(item.id)}
                        className="cursor-pointer text-red-500 hover:text-red-400 hover:bg-surface-2 focus:bg-surface-2 flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
