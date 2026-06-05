"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  Tag,
  Paperclip,
  Settings,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const NAV_ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Knowledge", href: "/knowledge", icon: BookOpen },
  { label: "Categories", href: "/categories", icon: FolderOpen },
  { label: "Tags", href: "/tags", icon: Tag },
  { label: "Files", href: "/files", icon: Paperclip },
  { label: "Settings", href: "/settings", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col bg-surface">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-6">
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M4 6L10 2L16 10L22 2L28 6V18L16 30L4 18V6Z"
            fill="var(--primary)"
            opacity="0.15"
          />
          <path
            d="M4 6L10 2L16 10L22 2L28 6V18L16 30L4 18V6Z"
            stroke="var(--primary)"
            strokeWidth="2"
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
        <span className="text-lg font-bold tracking-tight text-text">
          TicketFox
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3" aria-label="Main navigation">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "bg-primary-soft text-primary"
                      : "text-text-muted hover:bg-surface-2 hover:text-text"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={20} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User profile */}
      <div className="shrink-0 border-t border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
            IT
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text">User</span>
            <span className="text-xs text-text-faint">IT Technician</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-border bg-surface lg:flex">
      <SidebarContent />
    </aside>
  );
}

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
      <div className="flex items-center gap-3">
        <svg
          width="24"
          height="24"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M4 6L10 2L16 10L22 2L28 6V18L16 30L4 18V6Z"
            fill="var(--primary)"
            opacity="0.15"
          />
          <path
            d="M4 6L10 2L16 10L22 2L28 6V18L16 30L4 18V6Z"
            stroke="var(--primary)"
            strokeWidth="2"
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
        <span className="text-lg font-bold tracking-tight text-text">
          TicketFox
        </span>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="text-text hover:bg-surface-2 hover:text-text" />
          }
        >
          <Menu className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] border-r border-border bg-surface p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
