"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ReactNode } from "react";
import { Token } from "@/feature/token/types";
import { MoreHorizontal, ExternalLink, Copy, Star } from "lucide-react";
interface TokenActionsPopoverProps {
    token: Token;
}

export function TokenActionsPopover({ token }: TokenActionsPopoverProps) {
    const handleCopyAddress = () => {
      if (token.addressLabel) {
        navigator.clipboard?.writeText(token.addressLabel).catch(() => {});
      }
    };
  
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
            onClick={(e) => e.stopPropagation()} // avoid opening dialog on click
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-44 border-zinc-800 bg-zinc-950 p-1 text-xs text-zinc-100"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-zinc-900"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View on explorer</span>
          </button>
          <button
            type="button"
            onClick={handleCopyAddress}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-zinc-900"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy address</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 hover:bg-zinc-900"
          >
            <Star className="h-3.5 w-3.5" />
            <span>Add to watchlist</span>
          </button>
        </PopoverContent>
      </Popover>
    );
  }