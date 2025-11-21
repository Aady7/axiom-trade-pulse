"use client";
import type { Token, TokenColumn as ColumnType } from "@/feature/token/types";
import { TokenCard } from "./TokenCard";
import { ColumnHeader } from "./ColumnHeader";
import React, { ReactNode } from "react";

interface TokenColumnProps {
  title: string;
  columnKey: ColumnType;
  tokens: Token[];
  isLoading?: boolean;
  skeletonComponent?: () => ReactNode;
}

function TokenColumnComponent({
    title,
    columnKey,
    tokens,
    isLoading = false,
    skeletonComponent,
  }: TokenColumnProps) {
    return (
      <section className="flex flex-col bg-[#05050b] border border-zinc-800/80 h-full min-h-0">
        {/* Column header with controls */}
        <ColumnHeader
          title={title}
          columnKey={columnKey}
          tokenCount={isLoading ? 0 : tokens.length}
        />
  
        {/* scroll area */}
        <div className="flex-1 overflow-y-auto min-h-0 scroll-thin">
          <div className="divide-y divide-zinc-800/80">
            {isLoading && skeletonComponent
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>{skeletonComponent()}</div>
                ))
              : tokens.map((token) => <TokenCard key={token.id} token={token} />)}
  
            {!isLoading && tokens.length === 0 && (
              <div className="px-3 py-4 text-center text-[11px] text-zinc-500">
                No tokens in this column yet.
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

export const TokenColumn = React.memo(TokenColumnComponent);