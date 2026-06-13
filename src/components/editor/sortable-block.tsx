"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BlockRenderer } from "./block-renderer";
import { BlockToolbar } from "./block-toolbar";
import type { Block, BlockType } from "@/types";

interface SortableBlockProps {
  block: Block;
  onContentChange: (id: string, content: string) => void;
  onTypeChange: (id: string, type: BlockType) => void;
  onDelete: (id: string) => void;
}

export function SortableBlock({
  block,
  onContentChange,
  onTypeChange,
  onDelete,
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="group flex flex-col gap-1 rounded-xl border border-border bg-surface px-4 pb-4 pt-2 transition-colors hover:border-text-faint/30"
    >
      <div className="flex items-center justify-between h-8 -mx-2">
        <div className="text-[10px] font-semibold tracking-wider text-text-faint uppercase px-2 opacity-0 transition-opacity group-hover:opacity-100">
          Block
        </div>
        <BlockToolbar
          blockType={block.type}
          onChangeType={(type) => onTypeChange(block.id, type)}
          onDelete={() => onDelete(block.id)}
          dragHandleProps={listeners}
        />
      </div>

      <div className="flex-1 min-w-0">
        <BlockRenderer
          block={block}
          onChange={(content) => onContentChange(block.id, content)}
        />
      </div>
    </div>
  );
}
