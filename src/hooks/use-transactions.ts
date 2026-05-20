import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchWalletData } from "@/lib/wallet-data";
import type { WalletData, WalletTransaction } from "@/types/wallet";
import { WALLET_DATA_STALE_TIME_MS, walletDataQueryKey } from "@/hooks/use-wallet-data";

export function useTransactions(address?: string): UseQueryResult<WalletTransaction[], Error> {
  const walletQuery = address?.trim() ?? "";

  return useQuery<WalletData, Error, WalletTransaction[]>({
    queryKey: walletDataQueryKey(walletQuery),
    queryFn: () => fetchWalletData(walletQuery),
    enabled: walletQuery.length > 0,
    staleTime: WALLET_DATA_STALE_TIME_MS,
    select: (wallet) => wallet.transactions,
  });
}
