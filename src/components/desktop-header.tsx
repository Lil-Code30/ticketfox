"use client";

import { Search } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

export function DesktopHeader() {
  const { isLoaded } = useUser();

  return (
    <header className="sticky top-0 z-30 hidden h-14 w-full items-center justify-between border-b border-border bg-surface/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-surface/60 lg:flex">
      <div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
        <Search size={16} className="text-text-faint" />
        <input
          type="text"
          placeholder="Search global knowledge base (cmd+k)..."
          className="w-full bg-transparent text-sm text-text placeholder:text-text-faint outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        {isLoaded ? (
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8",
              },
            }}
          />
        ) : (
          <div className="h-8 w-8 animate-pulse rounded-full bg-surface-2" />
        )}
      </div>
    </header>
  );
}
