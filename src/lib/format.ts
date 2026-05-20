export const ETHEREUM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

export function isEthereumAddress(value: string) {
  return ETHEREUM_ADDRESS_PATTERN.test(value.trim());
}

export function isEnsName(value: string) {
  return /^[a-z0-9-]+(\.[a-z0-9-]+)*\.eth$/i.test(value.trim());
}

export function isValidWalletInput(value: string) {
  return isEthereumAddress(value) || isEnsName(value);
}

export function normalizeWalletInput(value: string) {
  return value.trim();
}

export function shortenAddress(address: string, startLength = 6, endLength = 4) {
  const normalized = address.trim();

  if (normalized.length <= startLength + endLength) {
    return normalized;
  }

  return `${normalized.slice(0, startLength)}...${normalized.slice(-endLength)}`;
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}
