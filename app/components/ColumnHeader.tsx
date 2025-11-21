"use client";
import React, { useState, useCallback } from "react";
import { Zap, Filter } from "lucide-react";
import type { TokenColumn } from "@/feature/token/types";

interface ColumnHeaderProps {
  title: string;
  columnKey: TokenColumn;
  tokenCount: number;
}

function ColumnHeaderComponent({ title, columnKey, tokenCount }: ColumnHeaderProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"P1" | "P2" | "P3">(
    columnKey === "new_pairs" ? "P1" : columnKey === "final_stretch" ? "P2" : "P3"
  );
  const [hasActiveFilter, setHasActiveFilter] = useState(
    columnKey === "final_stretch" // Only final stretch has active filter in reference
  );

  // Memoize event handlers
  const handlePeriodClick = useCallback((period: "P1" | "P2" | "P3") => (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPeriod(period);
  }, []);

  const handleFilterToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setHasActiveFilter((prev) => !prev);
  }, []);

  return (
    <header className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-800/80">
      <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
      
      {/* Controls container - matches reference image */}
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800/60">
        {/* Lightning bolt icon */}
        <Zap className="h-3.5 w-3.5 text-zinc-500 fill-zinc-500" />
        
        {/* Count */}
        <span className="text-xs text-zinc-100 font-medium min-w-3 text-center">
          {tokenCount}
        </span>
        
        {/* Solana logo (gradient icon) - teal, purple, blue gradient */}
        <div className="h-4 w-4 rounded-full bg-linear-to-br from-[#14F195] via-[#9945FF] to-[#00D4FF] flex items-center justify-center shrink-0 p-0.5">
          <svg
            className="h-full w-full"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.02734 15.2168C5.02734 15.2168 9.53334 16.4192 12.0273 16.4192C14.5213 16.4192 19.0273 15.2168 19.0273 15.2168C19.0273 15.2168 20.0273 18.4192 12.0273 18.4192C4.02734 18.4192 5.02734 15.2168 5.02734 15.2168Z"
              fill="white"
            />
            <path
              d="M5.02734 8.7832C5.02734 8.7832 9.53334 7.5808 12.0273 7.5808C14.5213 7.5808 19.0273 8.7832 19.0273 8.7832C19.0273 8.7832 20.0273 5.5808 12.0273 5.5808C4.02734 5.5808 5.02734 8.7832 5.02734 8.7832Z"
              fill="white"
            />
          </svg>
        </div>
        
        {/* Segmented control: P1, P2, P3 */}
        <div className="flex items-center gap-0.5 bg-zinc-950/80 rounded px-0.5 py-0.5 border border-zinc-800/50">
          {(["P1", "P2", "P3"] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={handlePeriodClick(period)}
              className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                selectedPeriod === period
                  ? "bg-zinc-800 text-blue-400"
                  : "text-zinc-300 hover:text-zinc-100"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
        
        {/* Filter icon with optional active indicator */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={handleFilterToggle}
            className="p-0.5 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Filter className="h-3.5 w-3.5" />
          </button>
          {hasActiveFilter && (
            <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-blue-500 border border-zinc-900" />
          )}
        </div>
      </div>
    </header>
  );
}

export const ColumnHeader = React.memo(ColumnHeaderComponent);

