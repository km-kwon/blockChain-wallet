import { ArrowLeft } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import MobileControls from "@/components/gallery/mobile-controls";
import NftDetailOverlay from "@/components/gallery/nft-detail-overlay";
import DataSourceNotice from "@/components/shared/data-source-notice";
import ShareButton from "@/components/shared/share-button";
import ThemeToggle from "@/components/shared/theme-toggle";
import { useWalletData } from "@/hooks/use-wallet-data";
import { isValidWalletInput, normalizeWalletInput, shortenAddress } from "@/lib/format";
import { useUiStore } from "@/store/ui-store";
import type { NftItem } from "@/types/nft";
import NotFoundPage from "@/routes/not-found-page";
import { Link, useParams } from "react-router-dom";

const GalleryScene = lazy(() => import("@/components/gallery/gallery-scene"));

export default function GalleryPage() {
  const { address } = useParams();
  const routeAddress = normalizeWalletInput(address ?? "");
  const isRouteValid = isValidWalletInput(routeAddress);
  const walletQuery = useWalletData(routeAddress, { enabled: isRouteValid });
  const [selectedNft, setSelectedNft] = useState<NftItem | null>(null);
  const theme = useUiStore((state) => state.theme);

  if (!isRouteValid) {
    return <NotFoundPage />;
  }

  if (walletQuery.isPending) {
    return (
      <main className="flex h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <div className="mx-auto size-12 animate-pulse rounded-md bg-teal-300/30" />
          <p className="mt-4 text-sm text-slate-300">Preparing gallery space...</p>
        </div>
      </main>
    );
  }

  if (walletQuery.isError || !walletQuery.data) {
    return (
      <main className="flex h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="w-full max-w-md rounded-lg border border-white/15 bg-white/[0.08] p-6 text-center">
          <p className="text-sm font-medium text-rose-300">Gallery unavailable</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Unable to load wallet data</h1>
          <p className="mt-3 text-sm text-slate-300">
            {walletQuery.error?.message ?? "Try another address from the landing page."}
          </p>
          <Link
            className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-slate-950 transition hover:bg-teal-100"
            to="/"
          >
            Back home
          </Link>
        </section>
      </main>
    );
  }

  const wallet = walletQuery.data;
  const displayName = wallet.profile.ensName ?? wallet.profile.displayName;
  const isDark = theme === "dark";

  return (
    <main className="relative h-screen overflow-hidden bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-white">
      <Suspense fallback={<SceneFallback />}>
        <GalleryScene selectedNft={selectedNft} theme={theme} wallet={wallet} onSelectNft={setSelectedNft} />
      </Suspense>
      <section className="pointer-events-none fixed left-4 right-4 top-4 z-20 flex items-start justify-between gap-3">
        <div className="pointer-events-auto max-w-[calc(100vw-176px)] rounded-lg border border-slate-900/10 bg-white/[0.86] p-3 shadow-lg backdrop-blur dark:border-white/15 dark:bg-slate-950/[0.78]">
          <p className="text-xs uppercase tracking-[0.18em] text-teal-700 dark:text-teal-200">Wallet Gallery</p>
          <h1 className="mt-1 truncate text-lg font-semibold tracking-tight">{displayName}</h1>
          <p className="mt-1 truncate font-mono text-xs text-slate-500 dark:text-slate-400">
            {shortenAddress(wallet.profile.resolvedAddress, 8, 6)}
          </p>
        </div>
        <div className="pointer-events-auto flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <ShareButton
            text={`Explore ${displayName} as a 3D wallet gallery.`}
            title={`${displayName} gallery`}
          />
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-medium text-white shadow-lg transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-300/50 dark:bg-white dark:text-slate-950 dark:hover:bg-teal-100"
            to={`/${routeAddress}`}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Exit</span>
          </Link>
        </div>
      </section>
      {wallet.notice ? (
        <div className="fixed left-4 right-4 top-28 z-20 md:left-auto md:right-5 md:w-[360px]">
          <DataSourceNotice notice={wallet.notice} />
        </div>
      ) : null}
      {wallet.nfts.length === 0 ? <EmptyGalleryMessage /> : null}
      <MobileControls />
      <NftDetailOverlay nft={selectedNft} onClose={() => setSelectedNft(null)} />
      <div className={`pointer-events-none fixed inset-0 z-10 ${isDark ? "bg-slate-950/10" : "bg-transparent"}`} />
    </main>
  );
}

function SceneFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
      <div className="h-12 w-56 animate-pulse rounded-md bg-slate-300/70 dark:bg-white/[0.12]" />
    </div>
  );
}

function EmptyGalleryMessage() {
  return (
    <div className="fixed left-1/2 top-1/2 z-20 w-[min(360px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-900/10 bg-white/[0.88] p-5 text-center shadow-xl backdrop-blur dark:border-white/15 dark:bg-slate-950/[0.86]">
      <p className="text-sm font-medium text-teal-700 dark:text-teal-200">No NFTs found</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        This wallet still has a gallery room. Token allocation remains visible in the central hall.
      </p>
    </div>
  );
}
