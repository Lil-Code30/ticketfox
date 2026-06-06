"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { KnowledgeType } from "@/types";
import { KNOWLEDGE_TYPE_CONFIG } from "@/types";

interface KnowledgeFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  typeFilter: string;
  onTypeFilterChange: (val: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (val: string) => void;
  categories: any[];
}

export function KnowledgeFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
}: KnowledgeFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint"
        />
        <Input
          type="text"
          placeholder="Search knowledge base..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 border-border bg-surface text-text placeholder:text-text-faint focus-visible:ring-primary"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={typeFilter} onValueChange={(val) => onTypeFilterChange(val || "ALL")}>
          <SelectTrigger className="w-[140px] border-border bg-surface text-text">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="border-border bg-surface">
            <SelectItem value="ALL" className="text-text hover:bg-surface-2 focus:bg-surface-2 cursor-pointer">
              All Types
            </SelectItem>
            {(Object.keys(KNOWLEDGE_TYPE_CONFIG) as KnowledgeType[]).map(
              (type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className="text-text hover:bg-surface-2 focus:bg-surface-2 cursor-pointer"
                >
                  {KNOWLEDGE_TYPE_CONFIG[type].label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={(val) => onCategoryFilterChange(val || "ALL")}>
          <SelectTrigger className="w-[160px] border-border bg-surface text-text">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="border-border bg-surface">
            <SelectItem value="ALL" className="text-text hover:bg-surface-2 focus:bg-surface-2 cursor-pointer">
              All Categories
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem
                key={cat.id}
                value={cat.id}
                className="text-text hover:bg-surface-2 focus:bg-surface-2 cursor-pointer"
              >
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
