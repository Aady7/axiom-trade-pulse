"use client";
import { useQuery } from "@tanstack/react-query";
import type { TokenColumn , Token} from "../types";

async function fetchTokens(column: TokenColumn | "all" | null): Promise<Token[]> {
    const url = column && column !== "all" 
        ? `/api/tokens?column=${column}`
        : `/api/tokens`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch tokens: ${response.statusText}`);
    }
    const data = await response.json();
    return data.tokens;
}

export function useTokens(column: TokenColumn | "all" | null = "all") {
    return useQuery<Token[], Error>({
        queryKey: ["tokens", column ?? "all"],
        queryFn: () => fetchTokens(column),
    });
}