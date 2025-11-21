/// features/tokens/components/TokenCard.tsx
"use client";

import type { Token } from "@/feature/token/types";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setSelectedTokenId } from "@/feature/token/state/tokenTableSlice";
import { TokenLogoBorder } from "./TokenLogoBorder";
import { TokenActionsPopover } from "./TokenActionsPopover";
import { InfoToolTip } from "./InfoToolTip";
import {
  Users,
  CandlestickChart,
  Trophy,
  Crown,
  Search,
  Hand,
  CircleDollarSign,
  Copy,
  UserStar,
  ChefHat,
  Crosshair,
  Ghost,
  Boxes,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TokenCardProps {
  token: Token;
}

function formatCurrencyShort(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(2);
}

function TokenCardComponent({ token }: TokenCardProps) {
  const dispatch = useAppDispatch();
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const [txFlash, setTxFlash] = useState(false);
  const [holdersFlash, setHoldersFlash] = useState(false);
  
  // Price change flash effect
  const prevPriceRef = useRef<number | null>(null);
  const prevTxCountRef = useRef<number | null>(null);
  const prevHoldersRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!prevPriceRef.current) {
      prevPriceRef.current = token.priceUsd;
      prevTxCountRef.current = token.txCount;
      prevHoldersRef.current = token.holders;
      return;
    }
    
    // Price flash
    const priceDelta = token.priceUsd - prevPriceRef.current;
    if (priceDelta !== 0) {
      prevPriceRef.current = token.priceUsd;
      setFlash(priceDelta > 0 ? "up" : "down");
      const timeout = setTimeout(() => setFlash(null), 500);
      return () => clearTimeout(timeout);
    }
  }, [token.priceUsd]);

  useEffect(() => {
    // TX count flash
    if (prevTxCountRef.current !== null && token.txCount > prevTxCountRef.current) {
      prevTxCountRef.current = token.txCount;
      setTxFlash(true);
      const timeout = setTimeout(() => setTxFlash(false), 300);
      return () => clearTimeout(timeout);
    }
    prevTxCountRef.current = token.txCount;
  }, [token.txCount]);

  useEffect(() => {
    // Holders flash
    if (prevHoldersRef.current !== null && token.holders > prevHoldersRef.current) {
      prevHoldersRef.current = token.holders;
      setHoldersFlash(true);
      const timeout = setTimeout(() => setHoldersFlash(false), 300);
      return () => clearTimeout(timeout);
    }
    prevHoldersRef.current = token.holders;
  }, [token.holders]);

  // Memoize computed values
  const timeLabel = useMemo(() => token.timeLabel ?? "1h", [token.timeLabel]);
  const addressLabel = useMemo(() => token.addressLabel ?? token.tagLine ?? "", [token.addressLabel, token.tagLine]);
  const wins = useMemo(() => token.wins ?? 0, [token.wins]);
  const losses = useMemo(() => token.losses ?? 0, [token.losses]);

  // Memoize gradient style calculation
  const gradientStyle = useMemo(() => {
    const priceChangePct = token.change1mPct ?? token.change5mPct ?? token.change1hPct ?? 0;
    const normalizedChange = Math.max(-50, Math.min(50, priceChangePct));
    const gradientStop = 50 + normalizedChange;
    
    return {
      background: `linear-gradient(to right, 
        rgb(34, 197, 94) 0%, 
        rgb(34, 197, 94) ${gradientStop}%, 
        rgb(220, 38, 38) ${gradientStop}%, 
        rgb(220, 38, 38) 100%)`
    };
  }, [token.change1mPct, token.change5mPct, token.change1hPct]);

  // Memoize formatted currency values
  const formattedPrice = useMemo(
    () => formatCurrencyShort(token.priceUsd),
    [token.priceUsd]
  );
  
  const formattedMarketCap = useMemo(
    () => formatCurrencyShort(token.marketCapUsd),
    [token.marketCapUsd]
  );

  // Memoize event handlers
  const handleCardClick = useCallback(() => {
    dispatch(setSelectedTokenId(token.id));
  }, [dispatch, token.id]);

  const handleCopyAddress = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (token.addressLabel || token.tagLine) {
      navigator.clipboard?.writeText(token.addressLabel || token.tagLine || "").catch(() => {});
    }
  }, [token.addressLabel, token.tagLine]);

  const handlePopoverClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className="group rounded-none bg-[#05050b] px-3 py-2 shadow-sm shadow-black/40 hover:bg-[#272433] transition-colors cursor-pointer relative"
      onClick={handleCardClick}
    >
      {/* Main flex container: Logo on left, Row A/B/C on right */}
      <div className="flex gap-3">
        {/* LEFT: thumbnail */}
        <TokenLogoBorder token={token} priceDirection={flash}>
          {token.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={token.logoUrl}
              alt={token.name}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-black/80">
              {token.symbol.slice(0, 3).toUpperCase()}
            </div>
          )}
        </TokenLogoBorder>
      

        {/* RIGHT: Row A, Row B, Row C stacked vertically */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* Row A: name + V/MC */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="truncate text-[16px] font-semibold text-[#FCFCFC]">
                  {token.name}
                </span>
                <InfoToolTip label={`${token.symbol}`}>
                <span className="truncate text-[14px] font-semibold text-[#777A8c]">
                  {token.symbol}
                </span>
                </InfoToolTip>
                <InfoToolTip label={`${token.addressLabel}`}>
                  <button
                    type="button"
                    className="text-[10px] text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors"
                    onClick={handleCopyAddress}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </InfoToolTip>
              </div>
            </div>
            
            {/* Actions popover */}
            <div onClick={handlePopoverClick}>
              <TokenActionsPopover token={token} />
            </div>

            <div className="text-right text-[11px] leading-tight flex gap-2 items-center justify-between shrink-0">
              <InfoToolTip label={"Volume"}>
                <div className="flex items-center justify-end gap-1 text-zinc-300">
                  <span className="text-[12px] text-[#777A8c] font-medium whitespace-nowrap">V</span>
                  <span
                    className={[
                      "font-mono transition-colors duration-500 font-medium text-[12px] whitespace-nowrap max-w-[82px] overflow-hidden text-ellipsis text-right",
                      flash === "up" && "text-emerald-400",
                      flash === "down" && "text-red-400",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    ${formattedPrice}
                  </span>
                </div>
              </InfoToolTip>
              <InfoToolTip label={"Market Cap"}>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[12px] text-zinc-500 whitespace-nowrap">MC</span>
                  <span
                    className={[
                      "font-mono text-sky-400 transition-colors duration-500 font-medium text-[12px] whitespace-nowrap max-w-[92px] overflow-hidden text-ellipsis text-right",
                      flash === "up" && "text-emerald-400",
                      flash === "down" && "text-red-400",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    ${formattedMarketCap}
                  </span>
                </div>
              </InfoToolTip>
            </div>
          </div>

         
          <div className="flex items-center justify-between text-[11px]">
            {/* left side: time + coin + hand + search */}
            <div className="flex items-center gap-2 text-zinc-200">
              <InfoToolTip label="Token age">
                <span className="font-medium text-emerald-400">{timeLabel}</span>
              </InfoToolTip>
            
                <CircleDollarSign className="h-3.5 w-3.5 text-yellow-300" />
              
             
                <Hand className="h-3.5 w-3.5 text-zinc-200" />
          
            
                <Search className="h-3.5 w-3.5 text-zinc-300" />
             
            </div>

           
            <div className="flex items-center gap-2 text-[11px] shrink-0">
              <InfoToolTip label="Global Fees Paid">
                <div className="flex items-center gap-0.5">
                  <span className="text-[12px] text-zinc-500 font-medium ">F</span>
                  <span className=" text-[12px] text-[#52c5ff] bg-clip-text font-medium">
                    {(token.fScore ?? 0.917).toFixed(3)}
                  </span>
                </div>
              </InfoToolTip>
              <InfoToolTip label={"Transaction"}>
                <div className="flex items-center gap-1">
                  <span className="text-[12px] text-zinc-500 font-medium">TX</span>
                  <span
                    className={[
                      "font-mono text-[12px] transition-colors duration-300 font-medium",
                      txFlash ? "text-emerald-400" : "text-zinc-100",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {token.txCount}
                  </span>
                 
                    <span 
                      className="h-0.5 w-10 rounded-full transition-all duration-500"
                      style={gradientStyle}
                    />
                 
                </div>
              </InfoToolTip>
            </div>
          </div>

          {/* Row C: stats row (26, 12, 0, 0/1) */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-300">
            
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-zinc-300" />
                <span
                  className={[
                    "transition-colors duration-300",
                    holdersFlash && "text-emerald-400",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {token.holders}
                </span>
              </span>
         
          
              <span className="inline-flex items-center gap-1">
                <CandlestickChart className="h-3.5 w-3.5 text-zinc-300" />
                {token.candlesCount ?? 0}
              </span>
          
            <InfoToolTip label={`KOL`}>
              <span className="inline-flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5 text-zinc-300" />
                {token.trophyCount ?? 0}
              </span>
            </InfoToolTip>
            <InfoToolTip label={`Dev Migration Created`}>
              <span className="inline-flex items-center gap-1">
                <Crown className="h-3.5 w-3.5 text-zinc-300" />
                {wins}/{losses}
              </span>
            </InfoToolTip>
          </div>
        </div>
      </div>

      {/* Below main flex: Row C (full width from left) */}

      {/* Below: Row D (full width from left) */}
      <div className="mt-2 text-[11px] text-zinc-500 truncate">
        {addressLabel}
      </div>

      {/* Row E: bottom badges and 0 SOL button */}
      <div className="mt-2 flex items-center justify-between gap-2">
        {token.badges && token.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 flex-1">
            {token.badges.map((badge) => {
              let base =
                "inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10px] font-medium";
              if (badge.tone === "positive") {
                base += " bg-zinc-800 text-emerald-400 ";
              } else if (badge.tone === "negative") {
                base += " bg-zinc-800 text-red-400 ";
              } else if (badge.tone === "status") {
                base += " bg-emerald-500 text-black border border-emerald-500";
              } else {
                base += " bg-zinc-800 text-zinc-200 border border-zinc-700/80";
              }

              return (
                <span key={badge.id} className={base}>
                  {badge.icon === "risk" && <UserStar className="h-4 w-4" />}
                  {badge.icon === "time" && <ChefHat className="h-4 w-4" />}
                  {badge.icon === "growth" && <Crosshair className="h-4 w-4" />}
                  {badge.icon === "status" && <Ghost className="h-4 w-4" />}
                  <span>{badge.label}</span>
                </span>
              );
            })}
          </div>
        )}
        
        {/* 0 SOL Button - Only visible on hover, positioned at bottom right */}
        <div className="md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 absolute bottom-4 md:right-4 right-0 px-1 ">
          <Button
            variant="sol"
            size="xs"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-2.5 py-1 md:h-7 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              // Handle buy/trade action 
              console.log("Buy token:", token.id);
            }}
          >
            <Zap className="h-3 w-3" />
            <span className="text-xs font-semibold">0 SOL</span>
          </Button>
        </div>
      </div>

    </div>
  );
}

// Memoize component with custom comparison
export const TokenCard = React.memo(TokenCardComponent, (prevProps, nextProps) => {
  // Only re-render if critical token data changed
  return (
    prevProps.token.id === nextProps.token.id &&
    prevProps.token.priceUsd === nextProps.token.priceUsd &&
    prevProps.token.marketCapUsd === nextProps.token.marketCapUsd &&
    prevProps.token.txCount === nextProps.token.txCount &&
    prevProps.token.holders === nextProps.token.holders &&
    prevProps.token.change1mPct === nextProps.token.change1mPct &&
    prevProps.token.change5mPct === nextProps.token.change5mPct &&
    prevProps.token.change1hPct === nextProps.token.change1hPct
  );
});
