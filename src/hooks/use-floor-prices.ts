import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getMockWalletData } from "@/lib/mock-data";
import type { FloorPriceMap } from "@/types/nft";
import { WALLET_DATA_STALE_TIME_MS } from "@/hooks/use-wallet-data";

export function useFloorPrices(contracts: string[] = []): UseQueryResult<FloorPriceMap, Error> {
  const contractsKey = [...contracts].sort().join(",");

  return useQuery<FloorPriceMap, Error>({
    queryKey: ["floor-prices", "mock", contractsKey],
    queryFn: async () => {
      const floorPrices = getMockWalletData("vitalik.eth").floorPrices;

      return contracts.reduce<FloorPriceMap>((prices, contractAddress) => {
        const floorPrice = floorPrices[contractAddress];

        if (floorPrice) {
          prices[contractAddress] = floorPrice;
        }

        return prices;
      }, {});
    },
    enabled: contracts.length > 0,
    staleTime: WALLET_DATA_STALE_TIME_MS,
  });
}
