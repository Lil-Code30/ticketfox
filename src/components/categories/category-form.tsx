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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Category } from "@/types";
import { CATEGORY_COLORS } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSave: (data: {
    name: string;
    description: string;
    color: string;
  }) => void;
}

export function CategoryForm({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [color, setColor] = useState(category?.color ?? CATEGORY_COLORS[0]);

  const isEditing = !!category;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim(), color });
    onOpenChange(false);
    if (!isEditing) {
      setName("");
      setDescription("");
      setColor(CATEGORY_COLORS[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-surface sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text">
            {isEditing ? "Edit Category" : "New Category"}
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            {isEditing
              ? "Update this category's details."
              : "Create a new category to organize knowledge entries."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-name" className="text-sm text-text">
              Name
            </Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Networking"
              className="border-border bg-background text-text placeholder:text-text-faint focus:border-primary"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cat-desc" className="text-sm text-text">
              Description
            </Label>
            <Textarea
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this category..."
              rows={3}
              className="border-border bg-background text-text placeholder:text-text-faint focus:border-primary resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm text-text">Color</Label>
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border shrink-0 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background transition-all">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute -inset-2 h-14 w-14 cursor-pointer appearance-none bg-transparent border-0 p-0"
                  aria-label="Select custom color"
                />
              </div>
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#000000"
                className="border-border bg-background text-text uppercase font-mono focus:border-primary"
                maxLength={7}
              />
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
              {isEditing ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
