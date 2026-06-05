"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tag } from "@/types";
import { TAG_COLORS } from "@/types";
import { cn } from "@/lib/utils";

interface TagFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: Tag | null;
  onSave: (data: { name: string; color: string }) => void;
}

export function TagForm({ open, onOpenChange, tag, onSave }: TagFormProps) {
  const [name, setName] = useState(tag?.name ?? "");
  const [color, setColor] = useState(tag?.color ?? TAG_COLORS[0]);

  const isEditing = !!tag;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), color });
    onOpenChange(false);
    if (!isEditing) {
      setName("");
      setColor(TAG_COLORS[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-surface sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-text">
            {isEditing ? "Edit Tag" : "New Tag"}
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            {isEditing
              ? "Update this tag's details."
              : "Create a new tag for knowledge entries."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tag-name" className="text-sm text-text">
              Name
            </Label>
            <Input
              id="tag-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VPN"
              className="border-border bg-background text-text placeholder:text-text-faint focus:border-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm text-text">Color</Label>
            <div className="flex flex-wrap gap-2">
              {TAG_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "h-7 w-7 rounded-full border-2 transition-all",
                    color === c
                      ? "border-text scale-110"
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border text-text hover:bg-surface-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-primary-hover"
            >
              {isEditing ? "Save Changes" : "Create Tag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
