import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchWalletData } from "@/lib/wallet-data";
import type { NftCollection, NftItem } from "@/types/nft";
import type { WalletData } from "@/types/wallet";
import { WALLET_DATA_STALE_TIME_MS, walletDataQueryKey } from "@/hooks/use-wallet-data";

export type WalletNftsResult = {
  collections: NftCollection[];
  nfts: NftItem[];
};

export function useNfts(address?: string): UseQueryResult<WalletNftsResult, Error> {
  const walletQuery = address?.trim() ?? "";

  return useQuery<WalletData, Error, WalletNftsResult>({
    queryKey: walletDataQueryKey(walletQuery),
    queryFn: () => fetchWalletData(walletQuery),
    enabled: walletQuery.length > 0,
    staleTime: WALLET_DATA_STALE_TIME_MS,
    select: (wallet) => ({
      collections: wallet.nftCollections,
      nfts: wallet.nfts,
    }),
  });
}
