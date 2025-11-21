"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function TokenCardSkeleton() {
  return (
    <div className="rounded-none bg-[#05050b] px-3 py-2 shadow-sm shadow-black/40 mb-2">
      {/* Main flex container: Logo on left, Row A/B/C on right */}
      <div className="flex gap-3">
        {/* LEFT: thumbnail skeleton */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden border-2 border-zinc-800 rounded-lg ">
          <Skeleton className="h-full w-full bg-zinc-900/50" />
        </div>

        {/* RIGHT: Row A, Row B, Row C stacked vertically */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* Row A: name + V/MC */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-24 bg-zinc-600/60" />
                <Skeleton className="h-3.5 w-16 bg-zinc-600/60" />
                <Skeleton className="h-4 w-4 rounded bg-zinc-600/60" />
              </div>
            </div>
            
            {/* Actions popover skeleton */}
            <Skeleton className="h-6 w-6 rounded-full bg-zinc-600/60 shrink-0" />

            {/* Price/MC skeleton */}
            <div className="text-right text-[11px] leading- tight flex gap-2 items-center justify-between shrink-0">
              <Skeleton className="h-3.5 w-16 bg-zinc-600/60" />
              <Skeleton className="h-3.5 w-20 bg-zinc-600/60" />
            </div>
          </div>

          {/* Row B: time + icons LEFT, F / TX + sparkline RIGHT */}
          <div className="flex items-center justify-between text-[11px]">
            {/* left side: time + coin + hand + search */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-6 rounded bg-zinc-600/60" />
              <Skeleton className="h-3.5 w-3.5 rounded bg-zinc-600/60" />
              <Skeleton className="h-3.5 w-3.5 rounded bg-zinc-600/60" />
            </div>

            {/* right side: F + TX + sparkline */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-0.5">
                <Skeleton className="h-3 w-3 bg-zinc-600/60" />
                <Skeleton className="h-3.5 w-12 bg-zinc-600/60" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-4 bg-zinc-600/60" />
                <Skeleton className="h-3.5 w-8 bg-zinc-600/60" />
                <Skeleton className="h-0.5 w-10 rounded-full bg-zinc-600/60" />
              </div>
            </div>
          </div>

          {/* Row C: stats row */}
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1">
              <Skeleton className="h-3.5 w-3.5 rounded bg-zinc-600/60" />
              <Skeleton className="h-3.5 w-6 bg-zinc-600/60" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-3.5 w-3.5 rounded bg-zinc-600/60" />
              <Skeleton className="h-3.5 w-6 bg-zinc-600/60" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-3.5 w-3.5 rounded bg-zinc-900/60" />
              <Skeleton className="h-3.5 w-4 bg-zinc-600/60" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-3.5 w-3.5 rounded bg-zinc-600/60" />
              <Skeleton className="h-3.5 w-8 bg-zinc-900/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Below: Row D (address label) */}
      <div className="mt-2">
        <Skeleton className="h-3 w-24 bg-zinc-600/60" />
      </div>

      {/* Row E: bottom badges */}
      <div className="mt-2 flex flex-wrap gap-1">
        <Skeleton className="h-3 w-60 rounded-full bg-zinc-600/60" />
        
      </div>
    </div>
  );
}

