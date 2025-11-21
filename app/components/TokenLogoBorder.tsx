"use client";
import type { Token } from "@/feature/token/types";

interface TokenLogoBorderProps {
  token: Token;
  priceDirection: "up" | "down" | null;
  children: React.ReactNode;
}

export function TokenLogoBorder({
  token,
  priceDirection,
  children,
}: TokenLogoBorderProps) {
  // Determine border color based on column type and price change
  const getBorderColor = () => {
    // Golden border for migrated pairs (highest priority)
    if (token.column === "migrated") {
      return "border-yellow-500";
    }

    // Use flash direction if available (most recent price change)
    if (priceDirection === "up") {
      return "border-emerald-500";
    } else if (priceDirection === "down") {
      return "border-red-500";
    }

    // Fallback: Check change percentages to determine direction
    // Prefer shorter timeframes for more recent changes
    const priceChangePct = token.change1mPct ?? token.change5mPct ?? token.change1hPct ?? 0;
    
    // Use a threshold to avoid flickering on very small changes
    const threshold = 0.1; // 0.1% threshold
    
    if (priceChangePct > threshold) {
      return "border-emerald-500";
    } else if (priceChangePct < -threshold) {
      return "border-red-500";
    }

    // Neutral border for no significant change
    return "border-zinc-700";
  };

  return (
    <div
      className={`relative h-18 w-18 shrink-0 overflow-hidden border-2 rounded-lg ${getBorderColor()} bg-[#f1a41b] transition-colors duration-500`}
    >
      {children}
    </div>
  );
}

