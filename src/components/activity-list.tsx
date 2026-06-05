import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  icon: LucideIcon;
  title: string;
  type: string;
  category: string;
  date: string;
}

interface ActivityListProps {
  items: ActivityItem[];
}

const TYPE_COLORS: Record<string, string> = {
  INCIDENT: "bg-red-500/10 text-red-400",
  DOCUMENTATION: "bg-blue-500/10 text-blue-400",
  RESOURCE: "bg-emerald-500/10 text-emerald-400",
  NOTE: "bg-violet-500/10 text-violet-400",
  CHECKLIST: "bg-amber-500/10 text-amber-400",
  SCRIPT: "bg-cyan-500/10 text-cyan-400",
};

export function ActivityList({ items }: ActivityListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-8 py-16 text-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="mb-4 opacity-40"
        >
          <path
            d="M4 6L10 2L16 10L22 2L28 6V18L16 30L4 18V6Z"
            stroke="var(--primary)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="12" cy="14" r="1.5" fill="var(--primary)" />
          <circle cx="20" cy="14" r="1.5" fill="var(--primary)" />
          <path
            d="M14 19L16 21L18 19"
            stroke="var(--primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-sm text-text-faint">
          No recent activity yet. Create your first knowledge entry to get
          started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface px-4 py-3 transition-colors duration-150 hover:border-text-faint"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-text-muted">
              <Icon size={18} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-text">
                {item.title}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                TYPE_COLORS[item.type] ?? "bg-surface-2 text-text-muted"
              )}
            >
              {item.type}
            </span>
            <span className="hidden shrink-0 text-xs text-text-faint sm:block">
              {item.category}
            </span>
            <span className="shrink-0 text-xs text-text-faint">
              {item.date}
            </span>
          </div>
        );
      })}
    </div>
  );
}
