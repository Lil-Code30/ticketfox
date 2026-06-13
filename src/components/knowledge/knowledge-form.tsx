"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlockEditor } from "@/components/editor/block-editor";
import { FileUploader } from "@/components/files/file-uploader";
import { PageHeader } from "@/components/page-header";
import { KNOWLEDGE_TYPE_CONFIG } from "@/types";
import type { KnowledgeType, Block, FileRecord } from "@/types";
import { createKnowledge, updateKnowledge } from "@/app/actions/knowledge";
import { toast } from "sonner";

export function KnowledgeForm({
  initialData,
  categories,
}: {
  initialData?: any;
  categories: any[];
}) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [summary, setSummary] = useState(initialData?.summary ?? "");
  const [type, setType] = useState<KnowledgeType>(initialData?.type ?? "INCIDENT");
  const [category, setCategory] = useState<string>(initialData?.categoryId ?? "");
  const [blocks, setBlocks] = useState<Block[]>(initialData?.blocks ?? []);
  const [files, setFiles] = useState<FileRecord[]>([]); // We could initialize with initialData.attachments if we supported files

  const handleFilesSelected = (selected: File[]) => {
    const newFiles: FileRecord[] = selected.map((f) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: f.name,
      originalName: f.name,
      mimeType: f.type || "application/octet-stream",
      type: "OTHER",
      size: f.size,
      storageKey: `uploads/${f.name}`,
      url: `/uploads/${f.name}`,
      uploadedById: null,
      createdAt: new Date(),
    }));
    setFiles((prev) => [...newFiles, ...prev]);
  };

  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    setLoading(true);
    try {
      const payload = {
        title,
        summary,
        type,
        status,
        categoryId: category || undefined,
        blocks: blocks.map((b, i) => ({
          type: b.type,
          order: i, // Ensure correct order
          content: b.content ?? undefined,
          metadata: b.metadata,
        })),
        // we omit tags and files for now in this iteration
      };

      if (isEditing) {
        const res = await updateKnowledge(initialData.id, payload);
        if (res.success) {
          toast.success("Entry updated successfully.");
          router.push(`/knowledge/${initialData.id}`);
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createKnowledge(payload);
        if (res.success) {
          toast.success("Entry created successfully.");
          router.push("/knowledge");
        } else {
          toast.error(res.error);
        }
      }
    } catch (e) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-[800px] flex-col gap-8 pb-12">
      <Button
        variant="ghost"
        className="w-fit gap-2 pl-0 text-text-muted hover:text-text hover:bg-transparent"
        onClick={() => router.back()}
        disabled={loading}
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      <PageHeader
        title={isEditing ? "Edit Entry" : "New Entry"}
        description={!isEditing ? "Create a new incident report, documentation, or resource." : ""}
        actions={
          <>
            <Button
              variant="outline"
              className="gap-2 border-border text-text hover:bg-surface-2"
              onClick={() => handleSave("DRAFT")}
              disabled={loading}
            >
              <Save size={16} />
              Save Draft
            </Button>
            <Button
              className="gap-2 bg-primary text-white hover:bg-primary-hover"
              onClick={() => handleSave("PUBLISHED")}
              disabled={!title.trim() || loading}
            >
              <Send size={16} />
              {isEditing ? "Update" : "Publish"}
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
        {/* Metadata section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-sm text-text">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. VPN Disconnects Randomly on Windows 11"
              className="border-border bg-background text-text text-base md:text-lg focus:border-primary"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="summary" className="text-sm text-text">Summary</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief overview of this entry..."
              rows={2}
              className="border-border bg-background text-text resize-none focus:border-primary"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-text">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as KnowledgeType)} disabled={loading}>
                <SelectTrigger className="border-border bg-background text-text">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="border-border bg-surface">
                  {(Object.keys(KNOWLEDGE_TYPE_CONFIG) as KnowledgeType[]).map((t) => (
                    <SelectItem key={t} value={t} className="text-text hover:bg-surface-2 cursor-pointer">
                      {KNOWLEDGE_TYPE_CONFIG[t].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-text">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v || "")} disabled={loading}>
                <SelectTrigger className="border-border bg-background text-text">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-border bg-surface">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-text hover:bg-surface-2 cursor-pointer">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <hr className="my-2 border-border" />

        {/* Content section */}
        <div className="flex flex-col gap-3">
          <Label className="text-base font-semibold text-text">Content</Label>
          <BlockEditor blocks={blocks} onChange={setBlocks} />
        </div>

        <hr className="my-2 border-border" />

        {/* Attachments section */}
        <div className="flex flex-col gap-3">
          <Label className="text-base font-semibold text-text">Attachments</Label>
          <FileUploader onFilesSelected={handleFilesSelected} />
          {files.length > 0 && (
            <ul className="mt-2 flex flex-col gap-2">
              {files.map((f) => (
                <li key={f.id} className="flex items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text">
                  <span className="truncate">{f.originalName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-text-muted hover:text-red-500 hover:bg-transparent px-2"
                    onClick={() => setFiles((prev) => prev.filter((file) => file.id !== f.id))}
                    disabled={loading}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
