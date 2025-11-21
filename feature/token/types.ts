
// features/tokens/types.ts

export type TokenColumn = "new_pairs" | "final_stretch" | "migrated";

export interface TokenBadge {
  id: string;
  label: string;   // e.g. "21%", "4h", "Paid"
  tone: "positive" | "negative" | "neutral" | "status" | "ghost" ;
  icon?: "risk" | "time" | "growth" | "status";
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  description?: string;  // e.g. "Wolverhampton Coi V"
  column: TokenColumn;

  priceUsd: number;
  marketCapUsd: number;
  fdvUsd?: number;

  ageSeconds: number;
  age?: string;  // formatted age like "1d", "4mo", "1h"
  isBonding?: boolean;
  bondingProgressPct?: number;

  txCount: number;
  holders: number;
  liquidityUsd: number;

  change1mPct?: number;
  change5mPct?: number;
  change1hPct?: number;
  change6hPct?: number;
  change1dPct?: number;
  
  // Social/engagement metrics
  replies?: number;
  likes?: number;
  buyCount?: number;
  sellCount?: number;
  ratio?: number;
  solAmount?: number;
  
  // Status flags
  hasWebsite?: boolean;
  hasTelegram?: boolean;
  hasTwitter?: boolean;
  hasDiscord?: boolean;
  isKing?: boolean;

  chain: "SOL" | "ETH" | "OTHER";
  verified?: boolean;
  migratedFrom?: string | null;

  logoUrl?: string;
  tagLine?: string;

  // NEW, all optional:
  timeLabel?: string;       // e.g. "1h"
  addressLabel?: string;    // e.g. "8YBd...bonk"

  candlesCount?: number;    // 12
  trophyCount?: number;     // 0
  wins?: number;            // 0
  losses?: number;          // 1
  fScore?: number;          // 0.917

  badges?: TokenBadge[];    // bottom pills row
}
