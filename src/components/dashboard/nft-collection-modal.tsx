import { ExternalLink, X } from "lucide-react";
import { useEffect } from "react";
import { formatEth, formatUsd } from "@/lib/format";
import type { NftCollection } from "@/types/nft";

type NftCollectionModalProps = {
  collection: NftCollection | null;
  onClose: () => void;
};

export default function NftCollectionModal({ collection, onClose }: NftCollectionModalProps) {
  useEffect(() => {
    if (!collection) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [collection, onClose]);

  if (!collection) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/55 p-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <div
        aria-labelledby="nft-collection-title"
        aria-modal="true"
        className="max-h-[88vh] w-full max-w-3xl overflow-auto rounded-lg border bg-background shadow-xl"
        role="dialog"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b bg-background/95 p-5 backdrop-blur">
          <div>
            <p className="text-sm text-muted-foreground">NFT collection</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight" id="nft-collection-title">
              {collection.name}
            </h3>
          </div>
          <button
            aria-label="Close collection details"
            className="inline-flex size-10 items-center justify-center rounded-md border text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Owned" value={String(collection.ownedCount)} />
            <Metric label="Floor" value={formatEth(collection.floorPriceEth)} />
            <Metric label="Floor USD" value={formatUsd(collection.floorPriceUsd)} />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {collection.nfts.map((nft) => (
              <article className="rounded-lg border bg-white/60 p-3 dark:bg-slate-950/40" key={nft.id}>
                <img alt="" className="aspect-square w-full rounded-md border object-cover" src={nft.imageUrl} />
                <div className="mt-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{nft.name}</p>
                      <p className="text-sm text-muted-foreground">Token #{nft.tokenId}</p>
                    </div>
                    {nft.rarityRank ? (
                      <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                        Rank {nft.rarityRank}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{nft.description}</p>
                  <a
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:underline dark:text-teal-300"
                    href={nft.openseaUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    OpenSea
                    <ExternalLink aria-hidden="true" className="size-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-white/60 p-3 dark:bg-slate-950/40">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
