import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchMockWalletData } from "@/lib/mock-data";
import type { TokenBalance } from "@/types/token";
import type { WalletData } from "@/types/wallet";
import { WALLET_DATA_STALE_TIME_MS, walletDataQueryKey } from "@/hooks/use-wallet-data";

export function useTokenBalances(address?: string): UseQueryResult<TokenBalance[], Error> {
  const walletQuery = address?.trim() ?? "";

  return useQuery<WalletData, Error, TokenBalance[]>({
    queryKey: walletDataQueryKey(walletQuery),
    queryFn: () => fetchMockWalletData(walletQuery),
    enabled: walletQuery.length > 0,
    staleTime: WALLET_DATA_STALE_TIME_MS,
    select: (wallet) => wallet.tokens,
  });
}
