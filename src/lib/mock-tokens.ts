import { avatarImage } from "@/lib/mock-images";
import type { TokenBalance } from "@/types/token";

export const ETH_PRICE_USD = 3090;
export const MOCK_UPDATED_AT = "2026-05-20T00:00:00.000Z";

export const BASE_TOKENS: Omit<TokenBalance, "allocationPercent">[] = [
  {
    chainId: 1,
    contractAddress: "native",
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    logoUrl: avatarImage("ETH", ["#627eea", "#111827"]),
    balanceRaw: "18420000000000000000",
    balance: 18.42,
    priceUsd: ETH_PRICE_USD,
    valueUsd: 56917.8,
    change24hPercent: 2.18,
  },
  {
    chainId: 1,
    contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoUrl: avatarImage("USDC", ["#2563eb", "#38bdf8"]),
    balanceRaw: "4200000000",
    balance: 4200,
    priceUsd: 1,
    valueUsd: 4200,
    change24hPercent: 0,
  },
  {
    chainId: 1,
    contractAddress: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
    name: "Ethereum Name Service",
    symbol: "ENS",
    decimals: 18,
    logoUrl: avatarImage("ENS", ["#60a5fa", "#8b5cf6"]),
    balanceRaw: "125800000000000000000",
    balance: 125.8,
    priceUsd: 26.4,
    valueUsd: 3321.12,
    change24hPercent: -1.42,
  },
  {
    chainId: 1,
    contractAddress: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    name: "Uniswap",
    symbol: "UNI",
    decimals: 18,
    logoUrl: avatarImage("UNI", ["#ec4899", "#7c2d12"]),
    balanceRaw: "890000000000000000000",
    balance: 890,
    priceUsd: 8.35,
    valueUsd: 7431.5,
    change24hPercent: 4.86,
  },
];
