"use client";
import { lazy, Suspense, useMemo, useCallback } from "react";
import { useTokens } from "@/feature/token/hooks/useTokens";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { sortTokens } from "@/feature/token/utils";
import { TokenColumn } from "@/app/components/TokenColumn";
import TokenCardSkeleton from "@/app/components/TokenCardSkeleton";
import { useMockPriceFeed } from "@/feature/token/hooks/useMockPriceFeed";
import { setActiveColumn, setSelectedTokenId } from "@/feature/token/state/tokenTableSlice";
import {
  selectSortField,
  selectSortDirection,
  selectSelectedTokenId,
  selectActiveColumn,
} from "@/feature/token/state/tokenTableSelectors";
import type { TokenColumn as ColumnType } from "@/feature/token/types";

// Lazy load the dialog component for code splitting
const TokenDetailsDialog = lazy(() =>
  import("@/app/components/TokenDetailDialog").then((module) => ({
    default: module.TokenDetailsDialog,
  }))
);

export default function TokenTablePage() {
  useMockPriceFeed(2000);
  const dispatch = useAppDispatch();
  
  // Use memoized selectors
  const sortField = useAppSelector(selectSortField);
  const sortDirection = useAppSelector(selectSortDirection);
  const selectedTokenId = useAppSelector(selectSelectedTokenId);
  const activeColumn = useAppSelector(selectActiveColumn);
  const resolvedActiveColumn = useMemo<ColumnType>(
    () => (activeColumn === "all" || !activeColumn ? "new_pairs" : activeColumn),
    [activeColumn]
  );

  const { data, isLoading, isError, error } = useTokens();

  const tokens = data ?? [];

  // Memoize sorted tokens
  const sorted = useMemo(
    () => sortTokens(tokens, sortField, sortDirection),
    [tokens, sortField, sortDirection]
  );

  // Memoize filtered columns
  const { newPairs, finalStretch, migrated } = useMemo(
    () => ({
      newPairs: sorted.filter((t) => t.column === "new_pairs"),
      finalStretch: sorted.filter((t) => t.column === "final_stretch"),
      migrated: sorted.filter((t) => t.column === "migrated"),
    }),
    [sorted]
  );

  // Memoize selected token lookup
  const selectedToken = useMemo(
    () =>
      selectedTokenId ? tokens.find((t) => t.id === selectedTokenId) ?? null : null,
    [tokens, selectedTokenId]
  );

  // Memoize dialog state and handler
  const isDialogOpen = useMemo(() => selectedTokenId !== null, [selectedTokenId]);
  
  const handleDialogChange = useCallback(
    (open: boolean) => {
      if (!open) {
        dispatch(setSelectedTokenId(null));
      }
    },
    [dispatch]
  );

  const handleColumnChange = useCallback(
    (column: ColumnType) => {
      dispatch(setActiveColumn(column));
    },
    [dispatch]
  );

  const columns = useMemo(
    () => [
      { title: "New pairs", columnKey: "new_pairs" as ColumnType, tokens: newPairs },
      { title: "Final stretch", columnKey: "final_stretch" as ColumnType, tokens: finalStretch },
      { title: "Migrated", columnKey: "migrated" as ColumnType, tokens: migrated },
    ],
    [newPairs, finalStretch, migrated]
  );

  if (isError) {
    return (
      <main className="min-h-screen bg-black text-white p-2">
        <p className="text-red-400">Error: {error?.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-6 md:px-2">
      <header className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-xl md:text-2xl font-semibold">
          Token Discovery Board
        </h1>
        <p className="text-xs text-zinc-500">
          Sorting by <span className="font-mono">{sortField}</span> (
          <span className="font-mono">{sortDirection}</span>)
        </p>
      </header>

      {/* Mobile column selector */}
      <div className="md:hidden mb-3 flex items-center gap-2 overflow-x-auto pb-2">
        {columns.map((col) => (
          <button
            key={col.columnKey}
            type="button"
            onClick={() => handleColumnChange(col.columnKey)}
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              resolvedActiveColumn === col.columnKey
                ? "bg-white text-black"
                : "bg-zinc-900 text-zinc-400 border border-zinc-800"
            }`}
          >
            {col.title}
          </button>
        ))}
      </div>

      {/* Columns layout */}
      <section className="border border-zinc-800 overflow-hidden min-h-0 md:h-[calc(100vh-160px)]">
        {/* Mobile: show only active column */}
        <div className="md:hidden">
          {columns
            .filter((col) => resolvedActiveColumn === col.columnKey)
            .map((col) => (
              <TokenColumn
                key={col.columnKey}
                title={col.title}
                columnKey={col.columnKey}
                tokens={col.tokens}
                isLoading={isLoading}
                skeletonComponent={() => <TokenCardSkeleton />}
              />
            ))}
        </div>

        {/* Desktop: show all columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-0 min-h-0">
          {(isLoading ? columns.map((col) => ({ ...col, tokens: [] })) : columns).map((col) => (
            <TokenColumn
              key={col.columnKey}
              title={col.title}
              columnKey={col.columnKey}
              tokens={col.tokens}
              isLoading={isLoading}
              skeletonComponent={() => <TokenCardSkeleton />}
            />
          ))}
        </div>
      </section>

      {/* Token Details Dialog - Lazy loaded with Suspense */}
      <Suspense fallback={null}>
        <TokenDetailsDialog
          token={selectedToken}
          open={isDialogOpen}
          onOpenChange={handleDialogChange}
        />
      </Suspense>
    </main>
  );
}
