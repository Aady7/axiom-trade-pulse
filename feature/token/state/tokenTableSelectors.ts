import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

const selectTokenTable = (state: RootState) => state.tokenTable;

export const selectSortField = createSelector(
  [selectTokenTable],
  (table) => table.sortField
);

export const selectSortDirection = createSelector(
  [selectTokenTable],
  (table) => table.sortDirection
);

export const selectSelectedTokenId = createSelector(
  [selectTokenTable],
  (table) => table.selectedTokenId
);

export const selectActiveColumn = createSelector(
  [selectTokenTable],
  (table) => table.activeColumn
);

