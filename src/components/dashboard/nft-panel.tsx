import { Grid2X2, List } from "lucide-react";
import { useState } from "react";
import NftCollectionCard from "@/components/dashboard/nft-collection-card";
import NftCollectionModal from "@/components/dashboard/nft-collection-modal";
import type { NftCollection, NftViewMode } from "@/types/nft";

type NftPanelProps = {
  collections: NftCollection[];
};

export default function NftPanel({ collections }: NftPanelProps) {
  const [viewMode, setViewMode] = useState<NftViewMode>("grid");
  const [selectedCollection, setSelectedCollection] = useState<NftCollection | null>(null);

  return (
    <section className="rounded-lg border bg-white/75 p-5 shadow-sm dark:bg-slate-950/60">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">NFTs</h2>
          <p className="mt-1 text-sm text-muted-foreground">Collections grouped for dashboard and gallery views.</p>
        </div>
        <div className="inline-flex w-fit rounded-md border bg-white/65 p-1 dark:bg-slate-950/50">
          {(["grid", "list"] as const).map((mode) => {
            const Icon = mode === "grid" ? Grid2X2 : List;

            return (
              <button
                aria-label={`Show NFTs as ${mode}`}
                aria-pressed={viewMode === mode}
                className={`inline-flex h-8 items-center gap-1.5 rounded px-3 text-sm transition ${
                  viewMode === mode ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                key={mode}
                onClick={() => setViewMode(mode)}
                type="button"
              >
                <Icon aria-hidden="true" className="size-3.5" />
                {mode === "grid" ? "Grid" : "List"}
              </button>
            );
          })}
        </div>
      </div>
      {collections.length > 0 ? (
        <div className={viewMode === "grid" ? "mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3" : "mt-5 space-y-3"}>
          {collections.map((collection) => (
            <NftCollectionCard
              collection={collection}
              key={collection.contractAddress}
              onOpen={setSelectedCollection}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          No NFT collections found for this wallet.
        </div>
      )}
      <NftCollectionModal collection={selectedCollection} onClose={() => setSelectedCollection(null)} />
    </section>
  );
}
