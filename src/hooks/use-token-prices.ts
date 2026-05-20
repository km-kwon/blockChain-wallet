import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { createTokenPriceMapFromTokens, fetchTokenPrices } from "@/lib/coingecko";
import type { TokenBalance, TokenPriceMap } from "@/types/token";
import { WALLET_DATA_STALE_TIME_MS } from "@/hooks/use-wallet-data";

export function useTokenPrices(tokens: TokenBalance[] = []): UseQueryResult<TokenPriceMap, Error> {
  const tokenKey = tokens
    .map((token) => token.contractAddress)
    .sort()
    .join(",");

  return useQuery<TokenPriceMap, Error>({
    queryKey: ["token-prices", tokenKey],
    queryFn: async () => {
      try {
        return await fetchTokenPrices(tokens);
      } catch {
        return createTokenPriceMapFromTokens(tokens);
      }
    },
    enabled: tokens.length > 0,
    staleTime: WALLET_DATA_STALE_TIME_MS,
  });
}
