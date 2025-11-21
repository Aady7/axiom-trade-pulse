"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Token } from "@/feature/token/types";

interface TokenDetailsDialogProps {
  token: Token | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TokenDetailsDialog({
  token,
  open,
  onOpenChange,
}: TokenDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-zinc-800 bg-[#05050b] text-zinc-50">
        {token && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between gap-2">
                <span>{token.name}</span>
                <span className="text-xs text-zinc-400 uppercase tracking-wide">
                  {token.symbol}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Detailed overview of this pair&apos;s metrics.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Price</span>
                <span className="font-mono">
                  ${token.priceUsd.toFixed(4)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">Market Cap</span>
                <span className="font-mono">
                  ${token.marketCapUsd.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">Liquidity</span>
                <span className="font-mono">
                  ${token.liquidityUsd.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">Tx Count</span>
                <span className="font-mono">{token.txCount}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">Holders</span>
                <span className="font-mono">{token.holders}</span>
              </div>

              {token.fScore != null && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">F score</span>
                  <span className="text-[#52c5ff] bg-clip-text font-mono ">
                    {token.fScore.toFixed(3)}
                  </span>
                </div>
              )}

              {token.addressLabel && (
                <div className="pt-2 text-xs text-zinc-500">
                  Address:{" "}
                  <span className="font-mono">{token.addressLabel}</span>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}