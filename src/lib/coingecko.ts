import type { TokenBalance, TokenPriceMap } from "@/types/token";

const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3";

type CoinGeckoPriceEntry = {
  usd?: number;
  usd_24h_change?: number;
};

export async function fetchEthPriceUsd(): Promise<number> {
  const response = await fetchCoinGecko(
    `${COINGECKO_API_BASE_URL}/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true`,
  );
  const ethereum = readPriceEntry(readProperty(response, "ethereum"));

  return ethereum?.usd ?? 0;
}

export async function fetchTokenPrices(tokens: TokenBalance[]): Promise<TokenPriceMap> {
  const prices = createTokenPriceMapFromTokens(tokens);
  const now = new Date().toISOString();
  const [ethPrice, contractPrices] = await Promise.all([
    fetchNativeEthPriceEntry(),
    fetchContractPriceEntries(tokens),
  ]);

  tokens.forEach((token) => {
    const key = token.contractAddress.toLowerCase();
    const priceEntry = key === "native" ? ethPrice : contractPrices[key];

    if (!priceEntry?.usd) {
      return;
    }

    prices[token.contractAddress] = {
      change24hPercent: priceEntry.usd_24h_change ?? token.change24hPercent,
      contractAddress: token.contractAddress,
      priceUsd: priceEntry.usd,
      symbol: token.symbol,
      updatedAt: now,
    };
  });

  return prices;
}

export function createTokenPriceMapFromTokens(tokens: TokenBalance[]): TokenPriceMap {
  const now = new Date().toISOString();

  return tokens.reduce<TokenPriceMap>((prices, token) => {
    prices[token.contractAddress] = {
      change24hPercent: token.change24hPercent,
      contractAddress: token.contractAddress,
      priceUsd: token.priceUsd,
      symbol: token.symbol,
      updatedAt: now,
    };

    return prices;
  }, {});
}

async function fetchNativeEthPriceEntry(): Promise<CoinGeckoPriceEntry | null> {
  const response = await fetchCoinGecko(
    `${COINGECKO_API_BASE_URL}/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true`,
  );

  return readPriceEntry(readProperty(response, "ethereum"));
}

async function fetchContractPriceEntries(tokens: TokenBalance[]): Promise<Record<string, CoinGeckoPriceEntry>> {
  const contracts = tokens
    .map((token) => token.contractAddress.toLowerCase())
    .filter((contractAddress) => contractAddress !== "native")
    .slice(0, 50);

  if (contracts.length === 0) {
    return {};
  }

  const params = new URLSearchParams({
    contract_addresses: contracts.join(","),
    include_24hr_change: "true",
    vs_currencies: "usd",
  });
  const response = await fetchCoinGecko(
    `${COINGECKO_API_BASE_URL}/simple/token_price/ethereum?${params.toString()}`,
  );

  if (!isRecord(response)) {
    return {};
  }

  return Object.entries(response).reduce<Record<string, CoinGeckoPriceEntry>>((prices, [contractAddress, value]) => {
    const entry = readPriceEntry(value);

    if (entry) {
      prices[contractAddress.toLowerCase()] = entry;
    }

    return prices;
  }, {});
}

async function fetchCoinGecko(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko request failed with status ${response.status}.`);
  }

  return response.json() as Promise<unknown>;
}

function readPriceEntry(value: unknown): CoinGeckoPriceEntry | null {
  if (!isRecord(value)) {
    return null;
  }

  const usd = readNumber(value.usd);
  const change = readNumber(value.usd_24h_change);

  if (usd === undefined && change === undefined) {
    return null;
  }

  return {
    usd,
    usd_24h_change: change,
  };
}

function readProperty(value: unknown, key: string): unknown {
  return isRecord(value) ? value[key] : undefined;
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
