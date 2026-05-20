import { ArrowDownWideNarrow, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import AllocationDonut from "@/components/dashboard/allocation-donut";
import TokenListItem from "@/components/dashboard/token-list-item";
import type { TokenBalance, TokenSortMode } from "@/types/token";

type TokenPanelProps = {
  tokens: TokenBalance[];
};

export default function TokenPanel({ tokens }: TokenPanelProps) {
  const [sortMode, setSortMode] = useState<TokenSortMode>("value");
  const [hideSmallBalances, setHideSmallBalances] = useState(true);
  const visibleTokens = useMemo(() => {
    return tokens
      .filter((token) => !hideSmallBalances || token.valueUsd >= 1)
      .sort((a, b) => (sortMode === "value" ? b.valueUsd - a.valueUsd : b.balance - a.balance));
  }, [hideSmallBalances, sortMode, tokens]);

  return (
    <section className="rounded-lg border bg-white/75 p-5 shadow-sm dark:bg-slate-950/60">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Tokens</h2>
          <p className="mt-1 text-sm text-muted-foreground">Portfolio allocation by current USD value.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex rounded-md border bg-white/65 p-1 dark:bg-slate-950/50">
            {(["value", "balance"] as const).map((mode) => (
              <button
                aria-pressed={sortMode === mode}
                className={`inline-flex h-8 items-center gap-1.5 rounded px-3 text-sm transition ${
                  sortMode === mode ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                key={mode}
                onClick={() => setSortMode(mode)}
                type="button"
              >
                <ArrowDownWideNarrow aria-hidden="true" className="size-3.5" />
                {mode === "value" ? "Value" : "Balance"}
              </button>
            ))}
          </div>
          <button
            aria-pressed={hideSmallBalances}
            className="inline-flex h-10 items-center gap-2 rounded-md border bg-white/65 px-3 text-sm text-muted-foreground transition hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 dark:bg-slate-950/50"
            onClick={() => setHideSmallBalances((current) => !current)}
            type="button"
          >
            <EyeOff aria-hidden="true" className="size-4" />
            Under $1
          </button>
        </div>
      </div>
      {visibleTokens.length > 0 ? (
        <>
          <AllocationDonut tokens={visibleTokens} />
          <ul className="mt-5 space-y-3">
            {visibleTokens.map((token) => (
              <TokenListItem key={token.contractAddress} token={token} />
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-5 rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          No token balances match the current filters.
        </div>
      )}
    </section>
  );
}
