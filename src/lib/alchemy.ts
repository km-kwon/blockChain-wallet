import type {
  Alchemy as AlchemyClient,
  AssetTransfersWithMetadataResult,
  OwnedNft,
  OwnedToken,
} from "alchemy-sdk";
import { formatUnits } from "viem";
import { avatarImage, artImage } from "@/lib/mock-images";
import type { FloorPrice, FloorPriceMap, NftCollection, NftItem } from "@/types/nft";
import type { TokenBalance } from "@/types/token";
import type {
  WalletTransaction,
  WalletTransactionAsset,
  WalletTransactionType,
} from "@/types/wallet";

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY?.trim() ?? "";
let alchemyClient: AlchemyClient | null = null;
let alchemySdkPromise: Promise<typeof import("alchemy-sdk")> | null = null;

export function hasAlchemyApiKey() {
  return ALCHEMY_API_KEY.length > 0;
}

export function createAlchemyRpcUrl() {
  if (!hasAlchemyApiKey()) {
    throw new Error("VITE_ALCHEMY_API_KEY is required for live Ethereum data.");
  }

  return `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
}

export async function getAlchemyClient() {
  if (!hasAlchemyApiKey()) {
    throw new Error("VITE_ALCHEMY_API_KEY is required for live wallet data.");
  }

  if (!alchemyClient) {
    const { Alchemy, Network } = await getAlchemySdk();

    alchemyClient = new Alchemy({
      apiKey: ALCHEMY_API_KEY,
      maxRetries: 1,
      network: Network.ETH_MAINNET,
      requestTimeout: 12_000,
    });
  }

  return alchemyClient;
}

export async function fetchAlchemyTokenBalances(walletAddress: string): Promise<TokenBalance[]> {
  const { TokenBalanceType } = await getAlchemySdk();
  const alchemy = await getAlchemyClient();
  const [nativeBalance, erc20Tokens] = await Promise.all([
    alchemy.core.getBalance(walletAddress),
    alchemy.core.getTokensForOwner(walletAddress, {
      contractAddresses: TokenBalanceType.ERC20,
    }),
  ]);

  const nativeToken = createNativeToken(nativeBalance.toString());
  const tokens = erc20Tokens.tokens.map(mapOwnedToken).filter(isTokenBalance);

  return [nativeToken, ...tokens].filter((token) => token.balance > 0).slice(0, 50);
}

export async function fetchAlchemyNftItems(walletAddress: string): Promise<NftItem[]> {
  const alchemy = await getAlchemyClient();
  const response = await alchemy.nft.getNftsForOwner(walletAddress, {
    pageSize: 48,
    tokenUriTimeoutInMs: 0,
  });

  return response.ownedNfts.map(mapOwnedNft).filter(isNftItem);
}

export async function fetchAlchemyTransactions(walletAddress: string): Promise<WalletTransaction[]> {
  const { AssetTransfersCategory, SortingOrder } = await getAlchemySdk();
  const alchemy = await getAlchemyClient();
  const categories = [
    AssetTransfersCategory.EXTERNAL,
    AssetTransfersCategory.ERC20,
    AssetTransfersCategory.ERC721,
    AssetTransfersCategory.ERC1155,
    AssetTransfersCategory.SPECIALNFT,
  ];

  const [incoming, outgoing] = await Promise.all([
    alchemy.core.getAssetTransfers({
      category: categories,
      excludeZeroValue: false,
      fromBlock: "0x0",
      maxCount: 8,
      order: SortingOrder.DESCENDING,
      toAddress: walletAddress,
      withMetadata: true,
    }),
    alchemy.core.getAssetTransfers({
      category: categories,
      excludeZeroValue: false,
      fromAddress: walletAddress,
      fromBlock: "0x0",
      maxCount: 8,
      order: SortingOrder.DESCENDING,
      withMetadata: true,
    }),
  ]);

  const byId = new Map<string, WalletTransaction>();

  [...incoming.transfers, ...outgoing.transfers].forEach((transfer) => {
    const transaction = mapTransferToTransaction(transfer, walletAddress);
    byId.set(`${transfer.hash}:${transfer.uniqueId}`, transaction);
  });

  return [...byId.values()]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
}

export function applyNftFloorPrices(
  nfts: NftItem[],
  floorPrices: FloorPriceMap,
  ethPriceUsd: number,
): NftItem[] {
  return nfts.map((nft) => {
    const floorPrice = floorPrices[nft.contractAddress];
    const floorPriceEth = floorPrice?.floorPriceEth ?? nft.floorPriceEth;
    const floorPriceUsd =
      floorPrice?.floorPriceUsd ?? (floorPriceEth > 0 && ethPriceUsd > 0 ? floorPriceEth * ethPriceUsd : 0);

    return {
      ...nft,
      estimatedValueUsd: nft.estimatedValueUsd ?? floorPriceUsd,
      floorPriceEth,
    };
  });
}

export function createFloorPriceMapFromNfts(nfts: NftItem[], ethPriceUsd: number): FloorPriceMap {
  return nfts.reduce<FloorPriceMap>((prices, nft) => {
    if (prices[nft.contractAddress]) {
      return prices;
    }

    const floorPrice = createFloorPrice(nft, ethPriceUsd);

    if (floorPrice) {
      prices[nft.contractAddress] = floorPrice;
    }

    return prices;
  }, {});
}

export function groupNftsByCollection(
  nfts: NftItem[],
  floorPrices: FloorPriceMap,
  ethPriceUsd: number,
): NftCollection[] {
  const collections = new Map<string, NftCollection>();

  nfts.forEach((nft) => {
    const floorPrice = floorPrices[nft.contractAddress];
    const floorPriceEth = floorPrice?.floorPriceEth ?? nft.floorPriceEth;
    const floorPriceUsd =
      floorPrice?.floorPriceUsd ?? (floorPriceEth > 0 && ethPriceUsd > 0 ? floorPriceEth * ethPriceUsd : 0);
    const existing = collections.get(nft.contractAddress);

    if (existing) {
      existing.nfts.push(nft);
      existing.ownedCount += 1;
      existing.imageUrl = existing.imageUrl || nft.imageUrl;
      return;
    }

    collections.set(nft.contractAddress, {
      contractAddress: nft.contractAddress,
      description: nft.description,
      floorPriceEth,
      floorPriceUsd,
      imageUrl: nft.imageUrl,
      itemCount: 0,
      name: floorPrice?.collectionName ?? nft.collectionName,
      nfts: [nft],
      ownedCount: 1,
      slug: nft.collectionSlug,
    });
  });

  return [...collections.values()];
}

function createFloorPrice(nft: NftItem, ethPriceUsd: number): FloorPrice | null {
  if (nft.floorPriceEth <= 0) {
    return null;
  }

  return {
    collectionName: nft.collectionName,
    contractAddress: nft.contractAddress,
    floorPriceEth: nft.floorPriceEth,
    floorPriceUsd: ethPriceUsd > 0 ? nft.floorPriceEth * ethPriceUsd : 0,
    updatedAt: new Date().toISOString(),
  };
}

function createNativeToken(balanceRaw: string): TokenBalance {
  const balance = Number(formatUnits(BigInt(balanceRaw), 18));

  return {
    allocationPercent: 0,
    balance,
    balanceRaw,
    chainId: 1,
    change24hPercent: 0,
    contractAddress: "native",
    decimals: 18,
    logoUrl: avatarImage("ETH", ["#627eea", "#111827"]),
    name: "Ethereum",
    priceUsd: 0,
    symbol: "ETH",
    valueUsd: 0,
  };
}

function mapOwnedToken(token: OwnedToken): TokenBalance | null {
  if (token.error) {
    return null;
  }

  const decimals = token.decimals ?? 18;
  const rawBalance = normalizeRawBalance(token.rawBalance);
  const balance = parseOwnedTokenBalance(token, decimals);

  if (balance <= 0) {
    return null;
  }

  const symbol = token.symbol?.trim() || "TOKEN";

  return {
    allocationPercent: 0,
    balance,
    balanceRaw: rawBalance,
    chainId: 1,
    change24hPercent: 0,
    contractAddress: token.contractAddress.toLowerCase(),
    decimals,
    logoUrl: token.logo ?? avatarImage(symbol, ["#0f172a", "#14b8a6"]),
    name: token.name?.trim() || symbol,
    priceUsd: 0,
    symbol,
    valueUsd: 0,
  };
}

function mapOwnedNft(nft: OwnedNft): NftItem | null {
  const contractAddress = nft.contract.address.toLowerCase();
  const collectionName =
    nft.collection?.name ??
    nft.contract.openSeaMetadata.collectionName ??
    nft.contract.name ??
    "Untitled Collection";
  const collectionSlug = nft.contract.openSeaMetadata.collectionSlug ?? nft.collection?.slug ?? contractAddress;
  const imageUrl =
    nft.image.cachedUrl ??
    nft.image.pngUrl ??
    nft.image.thumbnailUrl ??
    nft.image.originalUrl ??
    artImage(nft.name ?? collectionName, ["#111827", "#14b8a6"]);
  const floorPriceEth = nft.contract.openSeaMetadata.floorPrice ?? 0;

  return {
    animationUrl: nft.animation?.cachedUrl ?? nft.animation?.originalUrl,
    collectionName,
    collectionSlug,
    contractAddress,
    description: nft.description ?? "",
    estimatedValueUsd: undefined,
    floorPriceEth,
    id: `${contractAddress}:${nft.tokenId}`,
    imageUrl,
    isRare: false,
    name: nft.name ?? `${collectionName} #${nft.tokenId}`,
    openseaUrl: `https://opensea.io/assets/ethereum/${contractAddress}/${nft.tokenId}`,
    rarityRank: undefined,
    rarityScore: undefined,
    tokenId: nft.tokenId,
    traits: [],
  };
}

function mapTransferToTransaction(
  transfer: AssetTransfersWithMetadataResult,
  walletAddress: string,
): WalletTransaction {
  const from = transfer.from;
  const to = transfer.to ?? walletAddress;
  const isOutgoing = from.toLowerCase() === walletAddress.toLowerCase();
  const asset = mapTransferAsset(transfer);
  const type = getTransactionType(transfer, isOutgoing);
  const label = asset.symbol ?? asset.collectionName ?? transfer.asset ?? "asset";

  return {
    asset,
    explorerUrl: `https://etherscan.io/tx/${transfer.hash}`,
    from,
    hash: transfer.hash,
    timestamp: transfer.metadata.blockTimestamp,
    title: `${isOutgoing ? "Sent" : "Received"} ${label}`,
    to,
    type,
  };
}

function mapTransferAsset(transfer: AssetTransfersWithMetadataResult): WalletTransactionAsset {
  const category = String(transfer.category);

  if (isNftTransferCategory(category)) {
    return {
      collectionName: transfer.asset ?? "NFT",
      tokenId: transfer.tokenId ?? transfer.erc721TokenId ?? undefined,
      type: category === "erc1155" ? "erc1155" : "erc721",
    };
  }

  if (category === "erc20") {
    return {
      amount: transfer.value ?? undefined,
      symbol: transfer.asset ?? "TOKEN",
      type: "erc20",
    };
  }

  return {
    amount: transfer.value ?? undefined,
    symbol: transfer.asset ?? "ETH",
    type: "native",
  };
}

function getTransactionType(
  transfer: AssetTransfersWithMetadataResult,
  isOutgoing: boolean,
): WalletTransactionType {
  if (isNftTransferCategory(String(transfer.category))) {
    return "transfer";
  }

  return isOutgoing ? "send" : "receive";
}

async function getAlchemySdk() {
  alchemySdkPromise ??= import("alchemy-sdk");
  return alchemySdkPromise;
}

function isNftTransferCategory(category: string) {
  return category === "erc721" || category === "erc1155" || category === "specialnft";
}

function parseOwnedTokenBalance(token: OwnedToken, decimals: number) {
  if (token.balance) {
    const formatted = Number(token.balance);
    return Number.isFinite(formatted) ? formatted : 0;
  }

  if (!token.rawBalance) {
    return 0;
  }

  return Number(formatUnits(BigInt(token.rawBalance), decimals));
}

function normalizeRawBalance(rawBalance?: string) {
  if (!rawBalance) {
    return "0";
  }

  return rawBalance.startsWith("0x") ? BigInt(rawBalance).toString() : rawBalance;
}

function isTokenBalance(token: TokenBalance | null): token is TokenBalance {
  return Boolean(token);
}

function isNftItem(nft: NftItem | null): nft is NftItem {
  return Boolean(nft);
}
