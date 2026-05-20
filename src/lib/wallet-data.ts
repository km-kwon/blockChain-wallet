import {
  applyNftFloorPrices,
  createFloorPriceMapFromNfts,
  fetchAlchemyNftItems,
  fetchAlchemyTokenBalances,
  fetchAlchemyTransactions,
  groupNftsByCollection,
  hasAlchemyApiKey,
} from "@/lib/alchemy";
import {
  createTokenPriceMapFromTokens,
  fetchEthPriceUsd,
  fetchTokenPrices,
} from "@/lib/coingecko";
import { resolveEnsProfile } from "@/lib/ens";
import { fetchMockWalletData } from "@/lib/mock-data";
import type { NftItem } from "@/types/nft";
import type { TokenBalance, TokenPriceMap } from "@/types/token";
import type { WalletData, WalletSummary, WalletValuePoint } from "@/types/wallet";

export async function fetchWalletData(input: string): Promise<WalletData> {
  const query = input.trim();

  if (!query) {
    throw new Error("Wallet address is required.");
  }

  if (!hasAlchemyApiKey()) {
    return fetchMockWalletData(query);
  }

  try {
    return await fetchLiveWalletData(query);
  } catch (error) {
    const mockWallet = await fetchMockWalletData(query);
    const message = error instanceof Error ? error.message : "Live wallet data could not be loaded.";

    return {
      ...mockWallet,
      notice: {
        message: `${message} Showing demo data so the experience stays available.`,
        title: "Live data unavailable",
        tone: "warning",
      },
    };
  }
}

async function fetchLiveWalletData(query: string): Promise<WalletData> {
  const profile = await resolveEnsProfile(query);
  const [baseTokens, nftItems, transactions] = await Promise.all([
    fetchAlchemyTokenBalances(profile.resolvedAddress),
    fetchAlchemyNftItems(profile.resolvedAddress),
    fetchAlchemyTransactions(profile.resolvedAddress),
  ]);
  const tokenPrices = await fetchTokenPricesSafely(baseTokens);
  const tokens = applyTokenPrices(baseTokens, tokenPrices);
  const ethPriceUsd = tokenPrices.native?.priceUsd ?? (await fetchEthPriceUsd().catch(() => 0));
  const floorPrices = createFloorPriceMapFromNfts(nftItems, ethPriceUsd);
  const nfts = applyNftFloorPrices(nftItems, floorPrices, ethPriceUsd);
  const nftCollections = groupNftsByCollection(nfts, floorPrices, ethPriceUsd);
  const summary = createSummary(tokens, nfts, nftCollections.length);

  return {
    floorPrices,
    generatedAt: new Date().toISOString(),
    nftCollections,
    nfts,
    profile,
    query,
    source: "api",
    summary,
    tokenPrices,
    tokens,
    transactions,
    valueHistory: createValueHistory(summary, tokens),
  };
}

function applyTokenPrices(tokens: TokenBalance[], tokenPrices: TokenPriceMap): TokenBalance[] {
  const pricedTokens = tokens.map((token) => {
    const price = tokenPrices[token.contractAddress];
    const priceUsd = price?.priceUsd ?? token.priceUsd;
    const change24hPercent = price?.change24hPercent ?? token.change24hPercent;
    const valueUsd = token.balance * priceUsd;

    return {
      ...token,
      change24hPercent,
      priceUsd,
      valueUsd,
    };
  });
  const totalValueUsd = pricedTokens.reduce((sum, token) => sum + token.valueUsd, 0);

  return pricedTokens.map((token) => ({
    ...token,
    allocationPercent: totalValueUsd > 0 ? Number(((token.valueUsd / totalValueUsd) * 100).toFixed(2)) : 0,
  }));
}

function createSummary(tokens: TokenBalance[], nfts: NftItem[], collectionCount: number): WalletSummary {
  const tokenValueUsd = tokens.reduce((sum, token) => sum + token.valueUsd, 0);
  const nftValueUsd = nfts.reduce((sum, nft) => sum + (nft.estimatedValueUsd ?? 0), 0);
  const totalValueUsd = tokenValueUsd + nftValueUsd;
  const change24hUsd = tokens.reduce(
    (sum, token) => sum + token.valueUsd * (token.change24hPercent / 100),
    0,
  );

  return {
    change24hPercent: totalValueUsd > 0 ? (change24hUsd / totalValueUsd) * 100 : 0,
    change24hUsd,
    collectionCount,
    nftCount: nfts.length,
    tokenCount: tokens.length,
    totalValueUsd,
  };
}

function createValueHistory(summary: WalletSummary, tokens: TokenBalance[]): WalletValuePoint[] {
  const tokenValueUsd = tokens.reduce((sum, token) => sum + token.valueUsd, 0);
  const nftValueUsd = Math.max(summary.totalValueUsd - tokenValueUsd, 0);
  const dailyRatio = summary.change24hPercent / 100;
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const daysAgo = 6 - index;
    const date = new Date(today);
    const ratio = Math.max(0.1, 1 - dailyRatio * daysAgo * 0.35);

    date.setDate(today.getDate() - daysAgo);

    return {
      date: date.toISOString().slice(0, 10),
      nftsUsd: Number((nftValueUsd * ratio).toFixed(2)),
      tokensUsd: Number((tokenValueUsd * ratio).toFixed(2)),
      valueUsd: Number((summary.totalValueUsd * ratio).toFixed(2)),
    };
  });
}

async function fetchTokenPricesSafely(tokens: TokenBalance[]) {
  try {
    return await fetchTokenPrices(tokens);
  } catch {
    return createTokenPriceMapFromTokens(tokens);
  }
}
