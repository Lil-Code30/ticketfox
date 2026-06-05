import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardMetricCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  description: string;
  featured?: boolean;
}

export function DashboardMetricCard({
  label,
  value,
  icon: Icon,
  description,
  featured = false,
}: DashboardMetricCardProps) {
  return (
    <div
      className={cn(
        "group rounded-xl border border-border p-6 transition-colors duration-200 hover:border-text-faint",
        featured
          ? "sm:col-span-2 md:col-span-2 bg-primary-soft"
          : "bg-surface"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-muted">{label}</span>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            featured
              ? "bg-primary/20 text-primary"
              : "bg-surface-2 text-text-muted"
          )}
        >
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>
      <div
        className={cn(
          "mt-3 text-[40px] font-bold leading-none tracking-tight",
          featured ? "text-primary" : "text-text"
        )}
      >
        {value}
      </div>
      <p className="mt-2 text-xs text-text-faint">{description}</p>
    </div>
  );
}
