// lib/solana.ts
import { clusterApiUrl } from "@solana/web3.js";

export const SOLANA_NETWORK = "devnet" as const;

export const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl(SOLANA_NETWORK);
