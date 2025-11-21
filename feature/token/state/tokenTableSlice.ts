import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { TokenColumn } from "../types";

export type SortField =
  | "priceUsd"
  | "marketCapUsd"
  | "liquidityUsd"
  | "txCount"
  | "holders"
  | "ageSeconds";

export type SortDirection = "asc" | "desc";

export interface TokenTableState {
  activeColumn: TokenColumn | "all";
  sortField: SortField;
  sortDirection: SortDirection;
  selectedTokenId: string | null;
}

const initialState: TokenTableState = {
  activeColumn: "new_pairs", // default visible column
  sortField: "marketCapUsd",
  sortDirection: "desc",
  selectedTokenId: null,
};

const tokenTableSlice = createSlice({
  name: "tokenTable",
  initialState,
  reducers: {
    setActiveColumn(state, action: PayloadAction<TokenColumn | "all">) {
      state.activeColumn = action.payload;
    },
    setSortField(state, action: PayloadAction<SortField>) {
      const field = action.payload;
      if (state.sortField === field) {
        // toggle if same field clicked again
        state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      } else {
        state.sortField = field;
        state.sortDirection = "desc"; // default direction
      }
    },
    setSelectedTokenId(state, action: PayloadAction<string | null>) {
      state.selectedTokenId = action.payload;
    },
  },
});

export const { setActiveColumn, setSortField, setSelectedTokenId } =
  tokenTableSlice.actions;

export const tokenTableReducer = tokenTableSlice.reducer;