import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Gem, Send } from "lucide-react";
import { formatDateTime, formatNumber, formatUsd, shortenAddress } from "@/lib/format";
import type { WalletTransaction, WalletTransactionType } from "@/types/wallet";

type ActivityFeedProps = {
  transactions: WalletTransaction[];
};

const typeIcons: Record<WalletTransactionType, typeof ArrowDownLeft> = {
  receive: ArrowDownLeft,
  send: Send,
  swap: ArrowLeftRight,
  mint: Gem,
  transfer: ArrowUpRight,
};

export default function ActivityFeed({ transactions }: ActivityFeedProps) {
  return (
    <section className="rounded-lg border bg-white/75 p-5 shadow-sm dark:bg-slate-950/60">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
        <p className="mt-1 text-sm text-muted-foreground">Latest mock wallet transactions.</p>
      </div>
      {transactions.length > 0 ? (
        <ol className="mt-5 space-y-3">
          {transactions.slice(0, 5).map((transaction) => (
            <ActivityItem key={transaction.hash} transaction={transaction} />
          ))}
        </ol>
      ) : (
        <div className="mt-5 rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          No recent transactions found.
        </div>
      )}
    </section>
  );
}

function ActivityItem({ transaction }: { transaction: WalletTransaction }) {
  const Icon = typeIcons[transaction.type];

  return (
    <li className="flex gap-3 rounded-md border bg-white/60 p-3 dark:bg-slate-950/40">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon aria-hidden="true" className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="font-medium">{transaction.title}</p>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {shortenAddress(transaction.from)} to {shortenAddress(transaction.to)}
            </p>
          </div>
          <time className="shrink-0 text-sm text-muted-foreground" dateTime={transaction.timestamp}>
            {formatDateTime(transaction.timestamp)}
          </time>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{formatAsset(transaction)}</span>
          <a
            className="font-medium text-teal-700 hover:underline dark:text-teal-300"
            href={transaction.explorerUrl}
            rel="noreferrer"
            target="_blank"
          >
            View tx
          </a>
        </div>
      </div>
    </li>
  );
}

function formatAsset(transaction: WalletTransaction) {
  const asset = transaction.asset;

  if (asset.type === "erc721" || asset.type === "erc1155") {
    return `${asset.collectionName ?? "NFT"} #${asset.tokenId ?? "unknown"}`;
  }

  const amount = asset.amount ? `${formatNumber(asset.amount, 4)} ` : "";
  const value = asset.valueUsd ? ` · ${formatUsd(asset.valueUsd)}` : "";

  return `${amount}${asset.symbol ?? "asset"}${value}`;
}
