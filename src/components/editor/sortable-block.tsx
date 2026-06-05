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
      className="group relative flex gap-2 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-text-faint/30"
    >
      <div className="absolute -left-1 top-3">
        <BlockToolbar
          blockType={block.type}
          onChangeType={(type) => onTypeChange(block.id, type)}
          onDelete={() => onDelete(block.id)}
          dragHandleProps={listeners}
        />
      </div>

      <div className="ml-20 flex-1 min-w-0">
        <BlockRenderer
          block={block}
          onChange={(content) => onContentChange(block.id, content)}
        />
      </div>
    </div>
  );
}
