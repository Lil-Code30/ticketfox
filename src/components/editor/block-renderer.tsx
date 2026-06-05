"use client";

import { useRef, useEffect } from "react";
import { ImageIcon } from "lucide-react";
import type { Block, BlockType } from "@/types";

interface BlockRendererProps {
  block: Block;
  onChange: (content: string) => void;
  readOnly?: boolean;
}

export function BlockRenderer({ block, onChange, readOnly = false }: BlockRendererProps) {
  switch (block.type) {
    case "HEADING":
      return (
        <HeadingBlock
          content={block.content ?? ""}
          onChange={onChange}
          readOnly={readOnly}
        />
      );
    case "PARAGRAPH":
      return (
        <ParagraphBlock
          content={block.content ?? ""}
          onChange={onChange}
          readOnly={readOnly}
        />
      );
    case "STEP":
      return (
        <StepBlock
          content={block.content ?? ""}
          onChange={onChange}
          stepNumber={
            (block.metadata as Record<string, unknown>)?.stepNumber as number ?? 1
          }
          readOnly={readOnly}
        />
      );
    case "IMAGE":
      return <ImageBlock content={block.content ?? ""} readOnly={readOnly} />;
    default:
      return (
        <ParagraphBlock
          content={block.content ?? ""}
          onChange={onChange}
          readOnly={readOnly}
        />
      );
  }
}

// ──────────────────────────────────────────────
// Block sub-components
// ──────────────────────────────────────────────

function HeadingBlock({
  content,
  onChange,
  readOnly,
}: {
  content: string;
  onChange: (v: string) => void;
  readOnly: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.textContent !== content) {
      ref.current.textContent = content;
    }
  }, []);

  if (readOnly) {
    return (
      <h3 className="text-lg font-semibold text-text leading-snug">
        {content}
      </h3>
    );
  }

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent ?? "")}
      className="text-lg font-semibold text-text leading-snug outline-none empty:before:content-['Heading...'] empty:before:text-text-faint"
      role="textbox"
      aria-label="Heading block"
    />
  );
}

function ParagraphBlock({
  content,
  onChange,
  readOnly,
}: {
  content: string;
  onChange: (v: string) => void;
  readOnly: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.textContent !== content) {
      ref.current.textContent = content;
    }
  }, []);

  if (readOnly) {
    return (
      <p className="text-sm leading-relaxed text-text-muted">{content}</p>
    );
  }

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.textContent ?? "")}
      className="text-sm leading-relaxed text-text outline-none empty:before:content-['Write_something...'] empty:before:text-text-faint"
      role="textbox"
      aria-label="Paragraph block"
    />
  );
}

function StepBlock({
  content,
  onChange,
  stepNumber,
  readOnly,
}: {
  content: string;
  onChange: (v: string) => void;
  stepNumber: number;
  readOnly: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.textContent !== content) {
      ref.current.textContent = content;
    }
  }, []);

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary mt-0.5">
        {stepNumber}
      </div>
      {readOnly ? (
        <p className="text-sm leading-relaxed text-text-muted">{content}</p>
      ) : (
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onChange(e.currentTarget.textContent ?? "")}
          className="flex-1 text-sm leading-relaxed text-text outline-none empty:before:content-['Describe_this_step...'] empty:before:text-text-faint"
          role="textbox"
          aria-label={`Step ${stepNumber}`}
        />
      )}
    </div>
  );
}

function ImageBlock({
  content,
  readOnly,
}: {
  content: string;
  readOnly: boolean;
}) {
  if (content) {
    return (
      <div className="overflow-hidden rounded-lg border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={content}
          alt="Block image"
          className="max-h-[400px] w-full object-contain bg-surface-2"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-surface-2/50 px-6 py-10">
      <ImageIcon size={28} className="text-text-faint" />
      <p className="text-xs text-text-muted">
        {readOnly ? "No image" : "Click to upload an image"}
      </p>
    </div>
  );
}
