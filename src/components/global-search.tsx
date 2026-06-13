"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, BookOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchKnowledge } from "@/app/actions/search";
import { KNOWLEDGE_TYPE_CONFIG } from "@/types";
import type { KnowledgeType } from "@/types";

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Debounced search
  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      setSelectedIndex(0);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!value.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await searchKnowledge(value);
          if (res.success) {
            setResults(res.data || []);
          }
        } catch {
          // Silently fail search
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    []
  );

  // Keyboard navigation in results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      navigateToResult(results[selectedIndex].id);
    }
  };

  const navigateToResult = (id: string) => {
    setOpen(false);
    router.push(`/knowledge/${id}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Search trigger / input */}
      <div
        className={cn(
          "flex w-full items-center gap-2 rounded-lg border px-3 py-1.5 transition-all",
          open
            ? "border-primary ring-1 ring-primary bg-background"
            : "border-border bg-background hover:border-text-faint cursor-pointer"
        )}
        onClick={() => !open && setOpen(true)}
      >
        <Search size={16} className="shrink-0 text-text-faint" />
        {open ? (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search knowledge base..."
            className="w-full bg-transparent text-sm text-text placeholder:text-text-faint outline-none"
          />
        ) : (
          <span className="flex-1 text-sm text-text-faint">
            Search knowledge base...
          </span>
        )}

        {open && query ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSearch("");
              inputRef.current?.focus();
            }}
            className="shrink-0 text-text-faint hover:text-text transition-colors"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-text-faint sm:inline-flex">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Results dropdown */}
      {open && query.trim() && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/30">
          {loading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-8">
              <Loader2 size={16} className="animate-spin text-primary" />
              <span className="text-sm text-text-muted">Searching...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8">
              <BookOpen size={24} className="text-text-faint" />
              <p className="text-sm text-text-muted">
                No results found for &ldquo;{query}&rdquo;
              </p>
            </div>
          ) : (
            <div className="max-h-[320px] overflow-y-auto">
              <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-text-faint">
                {results.length} result{results.length !== 1 ? "s" : ""}
              </div>
              <ul>
                {results.map((item, index) => {
                  const typeConfig =
                    KNOWLEDGE_TYPE_CONFIG[item.type as KnowledgeType];
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => navigateToResult(item.id)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                          index === selectedIndex
                            ? "bg-primary/10"
                            : "hover:bg-surface-2"
                        )}
                      >
                        <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                          <span className="text-sm font-medium text-text truncate">
                            {item.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium"
                              style={{
                                backgroundColor: `${typeConfig?.color}15`,
                                color: typeConfig?.color,
                              }}
                            >
                              {typeConfig?.label}
                            </span>
                            {item.category && (
                              <span className="text-[11px] text-text-faint truncate">
                                {item.category.name}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight
                          size={14}
                          className={cn(
                            "shrink-0 transition-opacity",
                            index === selectedIndex
                              ? "text-primary opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
