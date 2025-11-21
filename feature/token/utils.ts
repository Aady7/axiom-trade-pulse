import type {Token, TokenColumn} from "./types";
import type { SortField, SortDirection } from "./state/tokenTableSlice";

export function sortTokens(tokens: Token[], sortField: SortField, sortDirection: SortDirection): Token[] {
    const dir = sortDirection === "asc" ? 1 : -1;
    return [...tokens].sort((a, b) => {
        const av = a[sortField] as unknown as number;
        const bv = b[sortField] as unknown as number;
        if (av === bv) return 0;
        return av > bv ? dir : -dir;
    });
}
