export type TokenSortMode = "value" | "balance";

export type TokenBalance = {
  chainId: number;
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  logoUrl: string;
  balanceRaw: string;
  balance: number;
  priceUsd: number;
  valueUsd: number;
  change24hPercent: number;
  allocationPercent: number;
};

export type TokenPrice = {
  contractAddress: string;
  symbol: string;
  priceUsd: number;
  change24hPercent: number;
  updatedAt: string;
};

export type TokenPriceMap = Record<string, TokenPrice>;
