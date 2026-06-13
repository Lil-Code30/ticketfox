"use client";

import { useState } from "react";
import { Trash2, FileIcon, ImageIcon, FileText, FileArchive, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { FileUploader } from "@/components/files/file-uploader";
import { deleteFile } from "@/app/actions/files";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import type { FileType } from "@/types";
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

interface FilesClientProps {
  initialFiles: any[];
}

export function FilesClient({ initialFiles }: FilesClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = initialFiles.filter((f) =>
    f.originalName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteFile(deleteTarget.id);
      if (res.success) {
        toast.success("File deleted successfully.");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete file.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleFilesSelected = async (selected: File[]) => {
    if (selected.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (const file of selected) {
        formData.append("files", file);
      }

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          `${result.data.length} file${result.data.length > 1 ? "s" : ""} uploaded successfully.`
        );
        router.refresh();
      } else {
        toast.error(result.error || "Failed to upload files.");
      }
    } catch {
      toast.error("An unexpected error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <FileUploader onFilesSelected={handleFilesSelected} />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-primary">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm font-medium">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {initialFiles.length === 0 ? (
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
                          backgroundColor: `${FILE_TYPE_CONFIG[file.type as FileType]?.color || "#6b7280"}15`,
                          color: FILE_TYPE_CONFIG[file.type as FileType]?.color || "#6b7280",
                        }}
                      >
                        {FILE_TYPE_CONFIG[file.type as FileType]?.label || file.type}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-text-muted md:table-cell">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="hidden px-4 py-3 text-text-muted md:table-cell">
                      {new Date(file.createdAt).toLocaleDateString()}
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
    </>
  );
}
