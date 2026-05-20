import { createPublicClient, getAddress, http, type Address } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { createAlchemyRpcUrl } from "@/lib/alchemy";
import { isEnsName, isEthereumAddress, shortenAddress } from "@/lib/format";
import { avatarImage } from "@/lib/mock-images";
import type { EnsProfile } from "@/types/wallet";

let ensClient: ReturnType<typeof createPublicClient> | null = null;

export async function resolveEnsProfile(input: string): Promise<EnsProfile> {
  const query = input.trim();

  if (isEnsName(query)) {
    return resolveEnsNameProfile(query);
  }

  if (isEthereumAddress(query)) {
    return resolveAddressProfile(query);
  }

  throw new Error("Enter a valid Ethereum address or ENS name.");
}

async function resolveEnsNameProfile(input: string): Promise<EnsProfile> {
  const client = getEnsClient();
  const ensName = normalize(input);
  const resolvedAddress = await client.getEnsAddress({ name: ensName });

  if (!resolvedAddress) {
    throw new Error(`${input} did not resolve to an Ethereum address.`);
  }

  const avatarUrl = await getEnsAvatar(ensName);

  return {
    avatarUrl: avatarUrl ?? avatarImage(ensName, ["#14b8a6", "#2563eb"]),
    displayName: ensName,
    ensName,
    input,
    isEns: true,
    resolvedAddress,
  };
}

async function resolveAddressProfile(input: string): Promise<EnsProfile> {
  const client = getEnsClient();
  const resolvedAddress = getAddress(input);
  const ensName = await client.getEnsName({ address: resolvedAddress as Address }).catch(() => null);
  const avatarUrl = ensName ? await getEnsAvatar(ensName) : null;
  const displayName = ensName ?? shortenAddress(resolvedAddress);

  return {
    avatarUrl: avatarUrl ?? avatarImage(displayName, ["#0f172a", "#14b8a6"]),
    displayName,
    ensName: ensName ?? undefined,
    input,
    isEns: Boolean(ensName),
    resolvedAddress,
  };
}

async function getEnsAvatar(ensName: string) {
  return getEnsClient()
    .getEnsAvatar({ name: normalize(ensName) })
    .catch(() => null);
}

function getEnsClient() {
  if (!ensClient) {
    ensClient = createPublicClient({
      chain: mainnet,
      transport: http(createAlchemyRpcUrl()),
    });
  }

  return ensClient;
}
