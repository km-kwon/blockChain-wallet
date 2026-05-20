import { Link, useParams } from "react-router-dom";
import { formatPercent, formatUsd } from "@/lib/format";
import { useWalletData } from "@/hooks/use-wallet-data";

export default function DashboardPage() {
  const { address } = useParams();
  const walletAddress = address ?? "";
  const walletQuery = useWalletData(walletAddress);
  const wallet = walletQuery.data;
  const displayAddress = (wallet?.profile.displayName ?? walletAddress) || "unknown wallet";
  const summaryCards = [
    {
      label: "Total Value",
      value: wallet ? formatUsd(wallet.summary.totalValueUsd) : "Loading",
    },
    {
      label: "24h Change",
      value: wallet
        ? `${formatUsd(wallet.summary.change24hUsd)} (${formatPercent(wallet.summary.change24hPercent)})`
        : "Loading",
    },
    {
      label: "Tokens",
      value: wallet ? String(wallet.summary.tokenCount) : "Loading",
    },
    {
      label: "NFTs",
      value: wallet ? String(wallet.summary.nftCount) : "Loading",
    },
  ];

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Dashboard</p>
            <h1 className="mt-2 break-all text-3xl font-semibold tracking-tight">{displayAddress}</h1>
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition hover:opacity-90"
            to={walletAddress ? `/${walletAddress}/gallery` : "/"}
          >
            Enter Gallery
          </Link>
        </div>
        <div className="grid gap-4 py-8 md:grid-cols-4">
          {summaryCards.map((card) => (
            <article className="rounded-lg border bg-white/70 p-5 shadow-sm dark:bg-slate-950/60" key={card.label}>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-3 text-2xl font-semibold">{card.value}</p>
            </article>
          ))}
        </div>
        <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          {walletQuery.isError
            ? "Mock wallet data could not be loaded."
            : `Mock data source is ready for ${displayAddress}. Dashboard panels, charts, and activity states come next.`}
        </p>
      </section>
    </main>
  );
}
