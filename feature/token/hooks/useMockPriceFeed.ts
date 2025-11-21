"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Token, TokenBadge } from "../types";

function getRandomFactor() {
  const min = -0.15; // Reduced volatility for more realistic updates
  const max = 0.15;
  return 1 + (Math.random() * (max - min) + min);
}

function formatAge(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo`;
  return `${Math.floor(seconds / 31536000)}y`;
}

function updateBadges(token: Token, priceChange: number): TokenBadge[] {
  if (!token.badges) return [];
  
  const BADGE_VALUE_MIN = -1000; // -1000%
  const BADGE_VALUE_MAX = 10000; // 10000%
  
  return token.badges.map((badge) => {
    // Update percentage badges based on price change
    if (badge.label.includes("%") && badge.tone !== "neutral" && badge.tone !== "status") {
      const currentValue = parseFloat(badge.label.replace("%", "").split(" ")[0]);
      if (!isNaN(currentValue)) {
        const newValue = Math.max(
          BADGE_VALUE_MIN,
          Math.min(BADGE_VALUE_MAX, currentValue + priceChange * 0.1)
        );
        return {
          ...badge,
          label: badge.label.includes(" ") 
            ? `${newValue > 0 ? "+" : ""}${newValue.toFixed(0)}% ${badge.label.split(" ")[1]}`
            : `${newValue > 0 ? "+" : ""}${newValue.toFixed(0)}%`,
          tone: newValue > 0 ? "positive" : newValue < 0 ? "negative" : "neutral",
        };
      }
    }
    return badge;
  });
}

export function useMockPriceFeed(intervalMs: number = 2000) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const id = setInterval(() => {
      // Update all possible query keys (all tokens, and individual columns)
      const queryKeys = [
        ["tokens", "all"],
        ["tokens", undefined],
        ["tokens", null],
      ];

      queryKeys.forEach((queryKey) => {
        queryClient.setQueryData<Token[] | undefined>(
          queryKey,
          (old) => {
          if (!old) return old;

          // Update all tokens with various live data changes
          const updated = old.map((token) => {
            // Constants for min/max bounds
            const PRICE_MIN = 0.000001;
            const PRICE_MAX = 1_000_000_000; // 1 billion
            const MARKET_CAP_MIN = 1000;
            const MARKET_CAP_MAX = 1_000_000_000_000; // 1 trillion
            const AGE_SECONDS_MAX = 315_360_000; // 10 years
            const TX_COUNT_MIN = 0;
            const TX_COUNT_MAX = 1_000_000;
            const HOLDERS_MIN = 1;
            const HOLDERS_MAX = 1_000_000;
            const CANDLES_COUNT_MIN = 0;
            const CANDLES_COUNT_MAX = 10_000;
            const F_SCORE_MIN = 0.3;
            const F_SCORE_MAX = 1.0;
            const CHANGE_PCT_MIN = -1000; // -1000%
            const CHANGE_PCT_MAX = 10000; // 10000%

            // Age always increments (time passes)
            const newAgeSeconds = Math.min(
              AGE_SECONDS_MAX,
              token.ageSeconds + intervalMs / 1000
            );
            const newAge = formatAge(newAgeSeconds);

            // Price update (70% chance per token)
            let newPrice = token.priceUsd;
            let newMarketCap = token.marketCapUsd;
            let priceChange = 0;

            if (Math.random() < 0.7) {
              const factor = getRandomFactor();
              newPrice = Math.max(
                PRICE_MIN,
                Math.min(PRICE_MAX, token.priceUsd * factor)
              );
              // Market cap changes proportionally with price
              newMarketCap = Math.max(
                MARKET_CAP_MIN,
                Math.min(MARKET_CAP_MAX, token.marketCapUsd * factor)
              );
              priceChange = ((newPrice - token.priceUsd) / token.priceUsd) * 100;
            }

            // Transaction count (occasionally increases)
            let newTxCount = token.txCount;
            if (Math.random() < 0.3) {
              newTxCount = Math.min(
                TX_COUNT_MAX,
                newTxCount + Math.floor(Math.random() * 3) + 1
              );
            }
            newTxCount = Math.max(TX_COUNT_MIN, newTxCount);

            // Holders (occasionally increases, rarely decreases)
            let newHolders = token.holders;
            if (Math.random() < 0.2) {
              if (Math.random() < 0.9) {
                newHolders = Math.min(
                  HOLDERS_MAX,
                  newHolders + Math.floor(Math.random() * 2) + 1
                );
              } else {
                newHolders = Math.max(HOLDERS_MIN, newHolders - 1);
              }
            }
            newHolders = Math.max(HOLDERS_MIN, Math.min(HOLDERS_MAX, newHolders));

            // Candles count (increases occasionally)
            let newCandlesCount = token.candlesCount ?? 0;
            if (Math.random() < 0.25) {
              newCandlesCount = Math.min(
                CANDLES_COUNT_MAX,
                newCandlesCount + 1
              );
            }
            newCandlesCount = Math.max(
              CANDLES_COUNT_MIN,
              Math.min(CANDLES_COUNT_MAX, newCandlesCount)
            );

            // F-Score (small variations, stays between 0.3 and 1.0)
            let newFScore = token.fScore ?? 0.5;
            if (Math.random() < 0.4) {
              const fChange = (Math.random() - 0.5) * 0.02;
              newFScore = Math.max(
                F_SCORE_MIN,
                Math.min(F_SCORE_MAX, newFScore + fChange)
              );
            }
            newFScore = Math.max(F_SCORE_MIN, Math.min(F_SCORE_MAX, newFScore));

            // Update change percentages with some decay and new changes
            const decayFactor = 0.95; // Slight decay over time
            const clampChange = (value: number) =>
              Math.max(CHANGE_PCT_MIN, Math.min(CHANGE_PCT_MAX, value));

            const newChange1m = clampChange(
              ((token.change1mPct ?? 0) * decayFactor) + priceChange * 0.5
            );
            const newChange5m = clampChange(
              ((token.change5mPct ?? 0) * decayFactor) + priceChange * 0.3
            );
            const newChange1h = clampChange(
              ((token.change1hPct ?? 0) * decayFactor) + priceChange * 0.2
            );
            const newChange6h = clampChange(
              ((token.change6hPct ?? 0) * decayFactor) + priceChange * 0.1
            );
            const newChange1d = clampChange(
              ((token.change1dPct ?? 0) * decayFactor) + priceChange * 0.05
            );

            // Update badges based on price performance
            const updatedBadges = updateBadges(token, priceChange);

            return {
              ...token,
              priceUsd: newPrice,
              marketCapUsd: newMarketCap,
              ageSeconds: newAgeSeconds,
              age: newAge,
              timeLabel: newAge,
              txCount: newTxCount,
              holders: newHolders,
              candlesCount: newCandlesCount,
              fScore: newFScore,
              change1mPct: newChange1m,
              change5mPct: newChange5m,
              change1hPct: newChange1h,
              change6hPct: newChange6h,
              change1dPct: newChange1d,
              badges: updatedBadges,
            };
          });

          return updated;
          }
        );
      });
    }, intervalMs);

    return () => clearInterval(id);
  }, [queryClient, intervalMs]);
}