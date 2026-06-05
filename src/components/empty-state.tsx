"use client";

import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center",
        className
      )}
    >
      {/* Fox mascot */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-5 opacity-40"
        aria-hidden="true"
      >
        <path
          d="M8 12L20 4L32 20L44 4L56 12V36L32 60L8 36V12Z"
          fill="var(--primary)"
          opacity="0.08"
        />
        <path
          d="M8 12L20 4L32 20L44 4L56 12V36L32 60L8 36V12Z"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="none"
          opacity="0.35"
        />
        <circle cx="24" cy="28" r="2.5" fill="var(--primary)" opacity="0.35" />
        <circle cx="40" cy="28" r="2.5" fill="var(--primary)" opacity="0.35" />
        <path
          d="M28 38L32 42L36 38"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.35"
        />
      </svg>

      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-text-muted">{description}</p>

      {actionLabel && (actionHref || onAction) && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className={cn(
                buttonVariants({ variant: "default" }),
                "mt-5 gap-2 bg-primary text-white hover:bg-primary-hover"
              )}
            >
              <Plus size={16} />
              {actionLabel}
            </Link>
          ) : (
            <Button
              onClick={onAction}
              className="mt-5 gap-2 bg-primary text-white hover:bg-primary-hover"
            >
              <Plus size={16} />
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
