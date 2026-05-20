import { formatNumber, formatPercent, formatUsd } from "@/lib/format";
import type { TokenBalance } from "@/types/token";

type TokenListItemProps = {
  token: TokenBalance;
};

export default function TokenListItem({ token }: TokenListItemProps) {
  const isPositive = token.change24hPercent >= 0;

  return (
    <li className="flex items-center gap-3 rounded-md border bg-white/60 p-3 dark:bg-slate-950/40">
      <img alt="" className="size-10 rounded-md border object-cover" src={token.logoUrl} />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{token.name}</p>
            <p className="text-sm text-muted-foreground">{formatNumber(token.balance, 4)} {token.symbol}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatUsd(token.valueUsd)}</p>
            <p className={isPositive ? "text-sm text-teal-600" : "text-sm text-rose-600"}>
              {formatPercent(token.change24hPercent)}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
