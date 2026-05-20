import { Image, TrendingUp, Wallet, Waves } from "lucide-react";
import { formatPercent, formatUsd } from "@/lib/format";
import type { WalletSummary } from "@/types/wallet";

type SummaryCardsProps = {
  summary: WalletSummary;
};

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      label: "Total Value",
      value: formatUsd(summary.totalValueUsd),
      meta: "Tokens and estimated NFT value",
      icon: Wallet,
    },
    {
      label: "24h Change",
      value: `${formatUsd(summary.change24hUsd)} (${formatPercent(summary.change24hPercent)})`,
      meta: summary.change24hPercent >= 0 ? "Portfolio is up today" : "Portfolio is down today",
      icon: TrendingUp,
    },
    {
      label: "Tokens",
      value: String(summary.tokenCount),
      meta: "ERC-20 and native balances",
      icon: Waves,
    },
    {
      label: "NFTs",
      value: String(summary.nftCount),
      meta: `${summary.collectionCount} collections`,
      icon: Image,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Wallet summary">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article className="rounded-lg border bg-white/75 p-5 shadow-sm dark:bg-slate-950/60" key={card.label}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight">{card.value}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon aria-hidden="true" className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{card.meta}</p>
          </article>
        );
      })}
    </section>
  );
}
