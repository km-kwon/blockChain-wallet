import { AlertTriangle, Info } from "lucide-react";
import type { WalletDataNotice } from "@/types/wallet";

type DataSourceNoticeProps = {
  notice?: WalletDataNotice;
};

export default function DataSourceNotice({ notice }: DataSourceNoticeProps) {
  if (!notice) {
    return null;
  }

  const Icon = notice.tone === "warning" ? AlertTriangle : Info;

  return (
    <aside className="rounded-lg border border-amber-300/70 bg-amber-50 p-4 text-amber-950 shadow-sm dark:border-amber-300/30 dark:bg-amber-950/40 dark:text-amber-100">
      <div className="flex gap-3">
        <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <div>
          <p className="text-sm font-semibold">{notice.title}</p>
          <p className="mt-1 text-sm leading-6 opacity-85">{notice.message}</p>
        </div>
      </div>
    </aside>
  );
}
