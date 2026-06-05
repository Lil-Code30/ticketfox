"use client";

import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  className?: string;
}

export function FileUploader({ onFilesSelected, className }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      onFilesSelected?.(files);
    },
    [onFilesSelected]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        onFilesSelected?.(files);
      }
    },
    [onFilesSelected]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors cursor-pointer",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border bg-surface hover:border-text-faint",
        className
      )}
    >
      <Upload
        size={32}
        className={cn(
          "mb-3 transition-colors",
          isDragging ? "text-primary" : "text-text-faint"
        )}
      />
      <p className="text-sm font-medium text-text">
        {isDragging ? "Drop files here" : "Drag & drop files here"}
      </p>
      <p className="mt-1 text-xs text-text-muted">
        or click to browse — PNG, PDF, DOCX, TXT, ZIP
      </p>
      <input
        type="file"
        multiple
        onChange={handleFileInput}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Upload files"
      />
    </div>
  );
}
