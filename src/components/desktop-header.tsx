"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { GlobalSearch } from "@/components/global-search";

export function DesktopHeader() {
  const { isLoaded } = useUser();

  return (
    <header className="sticky top-0 z-30 hidden h-14 w-full items-center justify-between border-b border-border bg-surface/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-surface/60 lg:flex">
      <GlobalSearch />

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
