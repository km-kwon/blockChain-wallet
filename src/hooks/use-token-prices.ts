import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { TokenBalance, TokenPriceMap } from "@/types/token";
import { WALLET_DATA_STALE_TIME_MS } from "@/hooks/use-wallet-data";

export function useTokenPrices(tokens: TokenBalance[] = []): UseQueryResult<TokenPriceMap, Error> {
  const tokenKey = tokens
    .map((token) => token.contractAddress)
    .sort()
    .join(",");

  return useQuery<TokenPriceMap, Error>({
    queryKey: ["token-prices", "mock", tokenKey],
    queryFn: async () =>
      tokens.reduce<TokenPriceMap>((prices, token) => {
        prices[token.contractAddress] = {
          contractAddress: token.contractAddress,
          symbol: token.symbol,
          priceUsd: token.priceUsd,
          change24hPercent: token.change24hPercent,
          updatedAt: new Date().toISOString(),
        };

        return prices;
      }, {}),
    enabled: tokens.length > 0,
    staleTime: WALLET_DATA_STALE_TIME_MS,
  });
}
