export type NftViewMode = "grid" | "list";

export type NftTrait = {
  traitType: string;
  value: string;
  rarityPercent?: number;
};

export type NftItem = {
  id: string;
  contractAddress: string;
  tokenId: string;
  name: string;
  description: string;
  collectionName: string;
  collectionSlug: string;
  imageUrl: string;
  animationUrl?: string;
  floorPriceEth: number;
  estimatedValueUsd?: number;
  rarityRank?: number;
  rarityScore?: number;
  openseaUrl: string;
  isRare: boolean;
  traits: NftTrait[];
};

export type NftCollection = {
  contractAddress: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  floorPriceEth: number;
  floorPriceUsd: number;
  itemCount: number;
  ownedCount: number;
  nfts: NftItem[];
};

export type FloorPrice = {
  contractAddress: string;
  collectionName: string;
  floorPriceEth: number;
  floorPriceUsd: number;
  updatedAt: string;
};

export type FloorPriceMap = Record<string, FloorPrice>;
