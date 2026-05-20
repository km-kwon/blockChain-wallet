import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchWalletData } from "@/lib/wallet-data";
import type { WalletData } from "@/types/wallet";

export const WALLET_DATA_STALE_TIME_MS = 5 * 60 * 1000;

export const walletDataQueryKey = (address?: string) =>
  ["wallet-data", address?.trim().toLowerCase() ?? ""] as const;

type UseWalletDataOptions = {
  enabled?: boolean;
};

export function useWalletData(address?: string, options?: UseWalletDataOptions): UseQueryResult<WalletData, Error> {
  const walletQuery = address?.trim() ?? "";

  return useQuery<WalletData, Error>({
    queryKey: walletDataQueryKey(walletQuery),
    queryFn: () => fetchWalletData(walletQuery),
    enabled: (options?.enabled ?? true) && walletQuery.length > 0,
    staleTime: WALLET_DATA_STALE_TIME_MS,
  });
}
