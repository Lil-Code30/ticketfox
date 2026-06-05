"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus, Type, AlignLeft, ListOrdered, ImageIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortableBlock } from "./sortable-block";
import type { Block, BlockType } from "@/types";

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

const ADD_BLOCK_OPTIONS: { type: BlockType; label: string; icon: React.ReactNode }[] = [
  { type: "HEADING", label: "Heading", icon: <Type size={16} /> },
  { type: "PARAGRAPH", label: "Paragraph", icon: <AlignLeft size={16} /> },
  { type: "STEP", label: "Step", icon: <ListOrdered size={16} /> },
  { type: "IMAGE", label: "Image", icon: <ImageIcon size={16} /> },
];

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      const reordered = arrayMove(blocks, oldIndex, newIndex).map((b, i) => ({
        ...b,
        order: i,
      }));
      onChange(reordered);
    },
    [blocks, onChange]
  );

  const handleContentChange = useCallback(
    (id: string, content: string) => {
      onChange(
        blocks.map((b) => (b.id === id ? { ...b, content } : b))
      );
    },
    [blocks, onChange]
  );

  const handleTypeChange = useCallback(
    (id: string, type: BlockType) => {
      onChange(
        blocks.map((b) => (b.id === id ? { ...b, type } : b))
      );
    },
    [blocks, onChange]
  );

  const handleDelete = useCallback(
    (id: string) => {
      onChange(
        blocks
          .filter((b) => b.id !== id)
          .map((b, i) => ({ ...b, order: i }))
      );
    },
    [blocks, onChange]
  );

  const addBlock = useCallback(
    (type: BlockType) => {
      const stepCount = type === "STEP"
        ? blocks.filter((b) => b.type === "STEP").length + 1
        : undefined;

      const newBlock: Block = {
        id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        knowledgeId: "",
        type,
        order: blocks.length,
        content: "",
        metadata: stepCount ? { stepNumber: stepCount } : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      onChange([...blocks, newBlock]);
    },
    [blocks, onChange]
  );

  return (
    <div className="flex flex-col gap-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              onContentChange={handleContentChange}
              onTypeChange={handleTypeChange}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>

      {blocks.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
          <p className="text-sm text-text-muted">
            No blocks yet. Add your first block to start building this entry.
          </p>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline" }), "w-full gap-2 border-dashed border-border text-text-muted hover:border-primary hover:text-primary hover:bg-primary/5")}>
            <Plus size={16} />
            Add Block
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="border-border bg-surface w-48">
          {ADD_BLOCK_OPTIONS.map((opt) => (
            <DropdownMenuItem
              key={opt.type}
              onClick={() => addBlock(opt.type)}
              className="gap-2 text-text-muted hover:bg-surface-2 hover:text-text cursor-pointer"
            >
              {opt.icon}
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
