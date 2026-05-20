import ActivityFeed from "@/components/dashboard/activity-feed";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import NftPanel from "@/components/dashboard/nft-panel";
import SummaryCards from "@/components/dashboard/summary-cards";
import TokenPanel from "@/components/dashboard/token-panel";
import ValueChart from "@/components/dashboard/value-chart";
import DataSourceNotice from "@/components/shared/data-source-notice";
import { useWalletData } from "@/hooks/use-wallet-data";
import { isValidWalletInput, normalizeWalletInput } from "@/lib/format";
import NotFoundPage from "@/routes/not-found-page";
import { useParams } from "react-router-dom";

export default function DashboardPage() {
  const { address } = useParams();
  const walletAddress = normalizeWalletInput(address ?? "");
  const isRouteValid = isValidWalletInput(walletAddress);
  const walletQuery = useWalletData(walletAddress, { enabled: isRouteValid });
  const wallet = walletQuery.data;

  if (!isRouteValid) {
    return <NotFoundPage />;
  }

  if (walletQuery.isPending) {
    return (
      <main className="min-h-screen px-6 py-10">
        <section className="mx-auto max-w-7xl">
          <DashboardSkeleton />
        </section>
      </main>
    );
  }

  if (walletQuery.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-10">
        <section className="w-full max-w-lg rounded-lg border bg-white/75 p-6 text-center shadow-sm dark:bg-slate-950/60">
          <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Unable to load wallet data</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Try another address</h1>
          <p className="mt-3 text-sm text-muted-foreground">{walletQuery.error.message}</p>
        </section>
      </main>
    );
  }

  if (!wallet) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-10">
        <section className="w-full max-w-lg rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No wallet data is available for this route.
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-7xl space-y-6">
        <DashboardHeader profile={wallet.profile} routeAddress={walletAddress} />
        <DataSourceNotice notice={wallet.notice} />
        <SummaryCards summary={wallet.summary} />
        <div className="grid gap-6 xl:grid-cols-2">
          <TokenPanel tokens={wallet.tokens} />
          <NftPanel collections={wallet.nftCollections} />
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
          <ValueChart data={wallet.valueHistory} />
          <ActivityFeed transactions={wallet.transactions} />
        </div>
        <footer className="border-t py-6 text-center text-sm text-muted-foreground">
          Powered by Alchemy / CoinGecko
        </footer>
      </section>
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading dashboard">
      <div className="flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="size-16 animate-pulse rounded-md bg-muted" />
          <div className="space-y-3">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-8 w-56 animate-pulse rounded bg-muted" />
            <div className="h-10 w-72 max-w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="h-10 w-40 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div className="h-36 animate-pulse rounded-lg bg-muted" key={item} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-[520px] animate-pulse rounded-lg bg-muted" />
        <div className="h-[520px] animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}
