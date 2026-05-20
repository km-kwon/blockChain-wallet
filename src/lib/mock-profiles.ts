export const FALLBACK_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

export type EnsProfileSeed = {
  resolvedAddress: string;
  ensName: string;
  displayName: string;
  colors: readonly [string, string];
};

export const ENS_PROFILES: Record<string, EnsProfileSeed> = {
  "vitalik.eth": {
    resolvedAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    ensName: "vitalik.eth",
    displayName: "vitalik.eth",
    colors: ["#14b8a6", "#2563eb"],
  },
  "pranksy.eth": {
    resolvedAddress: "0x8a90Cab2b38dba80c64b7734e58e1dB38B8992e0",
    ensName: "pranksy.eth",
    displayName: "pranksy.eth",
    colors: ["#f97316", "#0f766e"],
  },
  "punk6529.eth": {
    resolvedAddress: "0x6529163B58E7F5D3A33f07F8FdE9B502c0372A0F",
    ensName: "punk6529.eth",
    displayName: "punk6529.eth",
    colors: ["#e11d48", "#7c3aed"],
  },
  "cozomo.eth": {
    resolvedAddress: "0xCe90a7949bb78892F159F428D0dC23a8E3584d75",
    ensName: "cozomo.eth",
    displayName: "cozomo.eth",
    colors: ["#0891b2", "#ca8a04"],
  },
};
