import { isEnsName, isEthereumAddress, shortenAddress } from "@/lib/format";
import { artImage, avatarImage } from "@/lib/mock-images";
import { BASE_NFT_COLLECTIONS } from "@/lib/mock-nfts";
import { ENS_PROFILES, FALLBACK_ADDRESS } from "@/lib/mock-profiles";
import { BASE_TOKENS, MOCK_UPDATED_AT } from "@/lib/mock-tokens";
import { BASE_TRANSACTIONS } from "@/lib/mock-transactions";
import type { FloorPriceMap, NftCollection, NftItem, NftTrait } from "@/types/nft";
import type { TokenBalance, TokenPriceMap } from "@/types/token";
import type {
  EnsProfile,
  WalletData,
  WalletSummary,
  WalletTransaction,
  WalletValuePoint,
} from "@/types/wallet";

export function getMockWalletData(input: string): WalletData {
  const query = input.trim() || "vitalik.eth";
  const profile = resolveMockProfile(query);
  const tokens = createTokens();
  const nftCollections = cloneNftCollections(BASE_NFT_COLLECTIONS);
  const nfts = nftCollections.flatMap((collection) => collection.nfts);
  const summary = createSummary(tokens, nftCollections, nfts);

  return {
    query,
    profile,
    summary,
    tokens,
    tokenPrices: createTokenPriceMap(tokens),
    nftCollections,
    nfts,
    floorPrices: createFloorPriceMap(nftCollections),
    valueHistory: createValueHistory(summary, tokens),
    transactions: createTransactions(profile.resolvedAddress),
    generatedAt: new Date().toISOString(),
    source: "mock",
  };
}

export async function fetchMockWalletData(input: string): Promise<WalletData> {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return getMockWalletData(input);
}

function resolveMockProfile(input: string): EnsProfile {
  const normalized = input.toLowerCase();
  const ensProfile = ENS_PROFILES[normalized];

  if (ensProfile) {
    return {
      input,
      resolvedAddress: ensProfile.resolvedAddress,
      ensName: ensProfile.ensName,
      displayName: ensProfile.displayName,
      avatarUrl: avatarImage(ensProfile.displayName, ensProfile.colors),
      isEns: true,
    };
  }

  const resolvedAddress = isEthereumAddress(input) ? input : FALLBACK_ADDRESS;
  const ensName = isEnsName(input) ? normalized : undefined;

  return {
    input,
    resolvedAddress,
    ensName,
    displayName: ensName ?? shortenAddress(resolvedAddress),
    avatarUrl: avatarImage(ensName ?? "0x", ["#0f172a", "#14b8a6"]),
    isEns: Boolean(ensName),
  };
}

function createTokens(): TokenBalance[] {
  const totalTokenValue = BASE_TOKENS.reduce((sum, token) => sum + token.valueUsd, 0);

  return BASE_TOKENS.map((token) => ({
    ...token,
    allocationPercent: Number(((token.valueUsd / totalTokenValue) * 100).toFixed(2)),
  }));
}

function createTokenPriceMap(tokens: TokenBalance[]): TokenPriceMap {
  return tokens.reduce<TokenPriceMap>((prices, token) => {
    prices[token.contractAddress] = {
      contractAddress: token.contractAddress,
      symbol: token.symbol,
      priceUsd: token.priceUsd,
      change24hPercent: token.change24hPercent,
      updatedAt: MOCK_UPDATED_AT,
    };

    return prices;
  }, {});
}

function createFloorPriceMap(collections: NftCollection[]): FloorPriceMap {
  return collections.reduce<FloorPriceMap>((prices, collection) => {
    prices[collection.contractAddress] = {
      contractAddress: collection.contractAddress,
      collectionName: collection.name,
      floorPriceEth: collection.floorPriceEth,
      floorPriceUsd: collection.floorPriceUsd,
      updatedAt: MOCK_UPDATED_AT,
    };

    return prices;
  }, {});
}

function createSummary(
  tokens: TokenBalance[],
  collections: NftCollection[],
  nfts: NftItem[],
): WalletSummary {
  const tokenValueUsd = tokens.reduce((sum, token) => sum + token.valueUsd, 0);
  const nftValueUsd = nfts.reduce((sum, nft) => sum + (nft.estimatedValueUsd ?? 0), 0);
  const totalValueUsd = tokenValueUsd + nftValueUsd;
  const change24hUsd = tokenValueUsd * 0.024 + nftValueUsd * 0.006;

  return {
    totalValueUsd,
    change24hUsd,
    change24hPercent: (change24hUsd / totalValueUsd) * 100,
    tokenCount: tokens.length,
    nftCount: nfts.length,
    collectionCount: collections.length,
  };
}

function createValueHistory(summary: WalletSummary, tokens: TokenBalance[]): WalletValuePoint[] {
  const tokenValueUsd = tokens.reduce((sum, token) => sum + token.valueUsd, 0);
  const nftValueUsd = summary.totalValueUsd - tokenValueUsd;
  const ratios = [0.92, 0.94, 0.975, 0.968, 0.991, 1.012, 1];

  return ratios.map((ratio, index) => ({
    date: `2026-05-${String(14 + index).padStart(2, "0")}`,
    valueUsd: Number((summary.totalValueUsd * ratio).toFixed(2)),
    tokensUsd: Number((tokenValueUsd * ratio).toFixed(2)),
    nftsUsd: Number((nftValueUsd * ratio).toFixed(2)),
  }));
}

function createTransactions(walletAddress: string): WalletTransaction[] {
  return BASE_TRANSACTIONS.map((transaction) => ({
    ...transaction,
    from: transaction.from === "$wallet" ? walletAddress : transaction.from,
    to: transaction.to === "$wallet" ? walletAddress : transaction.to,
    asset: { ...transaction.asset },
  }));
}

function cloneNftCollections(collections: NftCollection[]): NftCollection[] {
  return collections.map((collection) => ({
    ...collection,
    imageUrl: collection.imageUrl || artImage(collection.name, ["#111827", "#14b8a6"]),
    nfts: collection.nfts.map((nft) => ({
      ...nft,
      traits: nft.traits.map((trait: NftTrait) => ({ ...trait })),
    })),
  }));
}
