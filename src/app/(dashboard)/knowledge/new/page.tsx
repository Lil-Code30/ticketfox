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
import { MOCK_CATEGORIES } from "@/lib/mock-data";

export default function NewKnowledgePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [type, setType] = useState<KnowledgeType>("INCIDENT");
  const [category, setCategory] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [files, setFiles] = useState<FileRecord[]>([]);

  const handleFilesSelected = (selected: File[]) => {
    const newFiles: FileRecord[] = selected.map((f) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: f.name,
      originalName: f.name,
      mimeType: f.type || "application/octet-stream",
      type: "OTHER", // Simplified for UI
      size: f.size,
      storageKey: `uploads/${f.name}`,
      url: `/uploads/${f.name}`,
      uploadedById: null,
      createdAt: new Date(),
    }));
    setFiles((prev) => [...newFiles, ...prev]);
  };

  const handleSave = (status: "DRAFT" | "PUBLISHED") => {
    // In a real app, this would be a server action call
    console.log("Saving entry...", { title, summary, type, category, blocks, files, status });
    router.push("/knowledge");
  };

  return (
    <div className="mx-auto flex max-w-[800px] flex-col gap-8 pb-12">
      <Button
        variant="ghost"
        className="w-fit gap-2 pl-0 text-text-muted hover:text-text hover:bg-transparent"
        onClick={() => router.back()}
      >
        <ArrowLeft size={16} />
        Back to Knowledge
      </Button>

      <PageHeader
        title="New Entry"
        description="Create a new incident report, documentation, or resource."
        actions={
          <>
            <Button
              variant="outline"
              className="gap-2 border-border text-text hover:bg-surface-2"
              onClick={() => handleSave("DRAFT")}
            >
              <Save size={16} />
              Save Draft
            </Button>
            <Button
              className="gap-2 bg-primary text-white hover:bg-primary-hover"
              onClick={() => handleSave("PUBLISHED")}
              disabled={!title.trim()}
            >
              <Send size={16} />
              Publish
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
        {/* Metadata section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-sm text-text">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. VPN Disconnects Randomly on Windows 11"
              className="border-border bg-background text-text text-base md:text-lg focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="summary" className="text-sm text-text">
              Summary
            </Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief overview of this entry..."
              rows={2}
              className="border-border bg-background text-text resize-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-text">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as KnowledgeType)}>
                <SelectTrigger className="border-border bg-background text-text">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="border-border bg-surface">
                  {(Object.keys(KNOWLEDGE_TYPE_CONFIG) as KnowledgeType[]).map((t) => (
                    <SelectItem
                      key={t}
                      value={t}
                      className="text-text hover:bg-surface-2 focus:bg-surface-2 cursor-pointer"
                    >
                      {KNOWLEDGE_TYPE_CONFIG[t].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-text">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v || "")}>
                <SelectTrigger className="border-border bg-background text-text">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-border bg-surface">
                  {MOCK_CATEGORIES.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id}
                      className="text-text hover:bg-surface-2 focus:bg-surface-2 cursor-pointer"
                    >
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
                <li
                  key={f.id}
                  className="flex items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text"
                >
                  <span className="truncate">{f.originalName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-text-muted hover:text-red-500 hover:bg-transparent px-2"
                    onClick={() => setFiles((prev) => prev.filter((file) => file.id !== f.id))}
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
