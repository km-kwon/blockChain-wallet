import type { FloorPriceMap, NftCollection, NftItem } from "@/types/nft";
import type { TokenBalance, TokenPriceMap } from "@/types/token";

export type EnsProfile = {
  input: string;
  resolvedAddress: string;
  displayName: string;
  ensName?: string;
  avatarUrl?: string;
  isEns: boolean;
};

export type WalletSummary = {
  totalValueUsd: number;
  change24hUsd: number;
  change24hPercent: number;
  tokenCount: number;
  nftCount: number;
  collectionCount: number;
};

export type WalletValuePoint = {
  date: string;
  valueUsd: number;
  tokensUsd: number;
  nftsUsd: number;
};

export type WalletTransactionType = "receive" | "send" | "swap" | "mint" | "transfer";

export type WalletTransactionAsset = {
  type: "native" | "erc20" | "erc721" | "erc1155";
  symbol?: string;
  collectionName?: string;
  tokenId?: string;
  amount?: number;
  valueUsd?: number;
};

export type WalletTransaction = {
  hash: string;
  type: WalletTransactionType;
  timestamp: string;
  from: string;
  to: string;
  title: string;
  asset: WalletTransactionAsset;
  explorerUrl: string;
};

export type WalletData = {
  query: string;
  profile: EnsProfile;
  summary: WalletSummary;
  tokens: TokenBalance[];
  tokenPrices: TokenPriceMap;
  nftCollections: NftCollection[];
  nfts: NftItem[];
  floorPrices: FloorPriceMap;
  valueHistory: WalletValuePoint[];
  transactions: WalletTransaction[];
  generatedAt: string;
  source: "mock" | "api";
};
