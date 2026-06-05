"use client";

import { GripVertical, Trash2, ChevronDown } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BlockType } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BLOCK_TYPE_LABELS: Record<string, string> = {
  HEADING: "Heading",
  PARAGRAPH: "Paragraph",
  STEP: "Step",
  IMAGE: "Image",
};

interface BlockToolbarProps {
  blockType: BlockType;
  onChangeType: (type: BlockType) => void;
  onDelete: () => void;
  dragHandleProps?: Record<string, unknown>;
}

export function BlockToolbar({
  blockType,
  onChangeType,
  onDelete,
  dragHandleProps,
}: BlockToolbarProps) {
  return (
    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
      <button
        type="button"
        className="cursor-grab rounded p-1 text-text-faint hover:bg-surface-2 hover:text-text-muted active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...dragHandleProps}
      >
        <GripVertical size={16} />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-7 gap-1 px-2 text-xs text-text-muted hover:bg-surface-2 hover:text-text")}>
            {BLOCK_TYPE_LABELS[blockType] || blockType}
            <ChevronDown size={12} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="border-border bg-surface"
        >
          {(Object.keys(BLOCK_TYPE_LABELS) as BlockType[]).map((type) => (
            <DropdownMenuItem
              key={type}
              onClick={() => onChangeType(type)}
              className="text-text-muted hover:bg-surface-2 hover:text-text cursor-pointer"
            >
              {BLOCK_TYPE_LABELS[type]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="h-7 w-7 text-text-faint hover:bg-surface-2 hover:text-red-500"
      >
        <Trash2 size={14} />
      </Button>
    </div>
  );
}
