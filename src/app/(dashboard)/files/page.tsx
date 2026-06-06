"use client";

import { useState } from "react";
import { Trash2, FileIcon, ImageIcon, FileText, FileArchive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { FileUploader } from "@/components/files/file-uploader";

import type { FileRecord, FileType } from "@/types";
import { FILE_TYPE_CONFIG } from "@/types";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: FileType) {
  switch (type) {
    case "IMAGE":
      return <ImageIcon size={18} className="text-purple-400" />;
    case "PDF":
      return <FileText size={18} className="text-red-400" />;
    case "DOCX":
      return <FileText size={18} className="text-blue-400" />;
    case "ZIP":
      return <FileArchive size={18} className="text-yellow-400" />;
    default:
      return <FileIcon size={18} className="text-text-muted" />;
  }
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<FileRecord | null>(null);

  const filtered = files.filter((f) =>
    f.originalName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    if (!deleteTarget) return;
    setFiles((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleFilesSelected = (selected: File[]) => {
    const newFiles: FileRecord[] = selected.map((f) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: f.name,
      originalName: f.name,
      mimeType: f.type || "application/octet-stream",
      type: getFileTypeFromMime(f.type),
      size: f.size,
      storageKey: `uploads/${f.name}`,
      url: `/uploads/${f.name}`,
      uploadedById: null,
      createdAt: new Date(),
    }));
    setFiles((prev) => [...newFiles, ...prev]);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Files"
        description="Manage uploaded files and attachments for your knowledge base."
      />

      <FileUploader onFilesSelected={handleFilesSelected} />

      {files.length === 0 ? (
        <EmptyState
          title="No files uploaded"
          description="Upload files by dragging them into the area above or clicking to browse."
        />
      ) : (
        <>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search files..."
            className="max-w-sm"
          />

          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  <th className="px-4 py-3 font-medium text-text-muted">Name</th>
                  <th className="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">
                    Type
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-text-muted md:table-cell">
                    Size
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-text-muted md:table-cell">
                    Uploaded
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((file) => (
                  <tr
                    key={file.id}
                    className="transition-colors hover:bg-surface-2/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <span className="font-medium text-text truncate max-w-[200px] sm:max-w-none">
                          {file.originalName}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span
                        className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: `${FILE_TYPE_CONFIG[file.type].color}15`,
                          color: FILE_TYPE_CONFIG[file.type].color,
                        }}
                      >
                        {FILE_TYPE_CONFIG[file.type].label}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-text-muted md:table-cell">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="hidden px-4 py-3 text-text-muted md:table-cell">
                      {file.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(file)}
                        className="h-8 w-8 text-text-muted hover:text-red-500 hover:bg-surface-2"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-sm text-text-muted"
                    >
                      No files match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete File"
        description={`Are you sure you want to delete "${deleteTarget?.originalName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}

function getFileTypeFromMime(mime: string): FileType {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime === "application/pdf") return "PDF";
  if (mime.includes("wordprocessingml") || mime.includes("msword")) return "DOCX";
  if (mime === "text/plain") return "TXT";
  if (mime.includes("zip") || mime.includes("compressed")) return "ZIP";
  return "OTHER";
}
