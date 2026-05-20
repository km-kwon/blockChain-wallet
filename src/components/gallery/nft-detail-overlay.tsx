import { ExternalLink, X } from "lucide-react";
import { formatEth, formatUsd } from "@/lib/format";
import type { NftItem } from "@/types/nft";

type NftDetailOverlayProps = {
  nft: NftItem | null;
  onClose: () => void;
};

export default function NftDetailOverlay({ nft, onClose }: NftDetailOverlayProps) {
  if (!nft) {
    return null;
  }

  return (
    <aside className="fixed inset-x-4 bottom-4 z-30 max-h-[78vh] overflow-auto rounded-lg border border-white/20 bg-slate-950/88 p-4 text-white shadow-2xl backdrop-blur md:inset-x-auto md:right-5 md:top-20 md:w-[360px]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.18em] text-teal-200">NFT Details</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">{nft.name}</h2>
          <p className="mt-1 text-sm text-slate-300">{nft.collectionName}</p>
        </div>
        <button
          aria-label="Close NFT details"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-white/15 text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-300/40"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
      <img alt="" className="mt-4 aspect-square w-full rounded-md border border-white/15 object-cover" src={nft.imageUrl} />
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Metric label="Token ID" value={`#${nft.tokenId}`} />
        <Metric label="Floor" value={formatEth(nft.floorPriceEth)} />
        <Metric label="Estimate" value={nft.estimatedValueUsd ? formatUsd(nft.estimatedValueUsd) : "N/A"} />
        <Metric label="Rarity" value={nft.rarityRank ? `Rank ${nft.rarityRank}` : "Unranked"} />
      </dl>
      {nft.description ? <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-300">{nft.description}</p> : null}
      <a
        className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-300 px-4 text-sm font-medium text-slate-950 transition hover:bg-teal-200"
        href={nft.openseaUrl}
        rel="noreferrer"
        target="_blank"
      >
        OpenSea
        <ExternalLink aria-hidden="true" className="size-4" />
      </a>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/15 bg-white/[0.08] p-3">
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="mt-1 truncate font-medium">{value}</dd>
    </div>
  );
}
