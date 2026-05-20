import { formatEth, formatUsd } from "@/lib/format";
import type { NftCollection } from "@/types/nft";

type NftCollectionCardProps = {
  collection: NftCollection;
  onOpen: (collection: NftCollection) => void;
  viewMode: "grid" | "list";
};

export default function NftCollectionCard({ collection, onOpen, viewMode }: NftCollectionCardProps) {
  if (viewMode === "list") {
    return (
      <button
        className="flex w-full items-center gap-3 rounded-md border bg-white/60 p-3 text-left transition hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 dark:bg-slate-950/40"
        onClick={() => onOpen(collection)}
        type="button"
      >
        <img alt="" className="size-14 rounded-md border object-cover" src={collection.imageUrl} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{collection.name}</p>
          <p className="text-sm text-muted-foreground">{collection.ownedCount} owned</p>
        </div>
        <div className="text-right text-sm">
          <p className="font-medium">{formatEth(collection.floorPriceEth)}</p>
          <p className="text-muted-foreground">{formatUsd(collection.floorPriceUsd)}</p>
        </div>
      </button>
    );
  }

  return (
    <button
      className="overflow-hidden rounded-lg border bg-white/60 text-left shadow-sm transition hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 dark:bg-slate-950/40"
      onClick={() => onOpen(collection)}
      type="button"
    >
      <div className="aspect-square w-full overflow-hidden bg-muted">
        <img alt="" className="h-full w-full object-cover transition duration-300 hover:scale-105" src={collection.imageUrl} />
      </div>
      <div className="p-3">
        <p className="truncate font-medium">{collection.name}</p>
        <div className="mt-2 flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>{collection.ownedCount} owned</span>
          <span>{formatEth(collection.floorPriceEth)}</span>
        </div>
      </div>
    </button>
  );
}
