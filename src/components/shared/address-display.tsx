import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { shortenAddress } from "@/lib/format";

type AddressDisplayProps = {
  address: string;
};

export default function AddressDisplay({ address }: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-md border bg-white/65 px-3 py-2 text-sm dark:bg-slate-950/50">
      <span className="truncate font-mono text-muted-foreground" title={address}>
        {shortenAddress(address, 8, 6)}
      </span>
      <button
        aria-label={copied ? "Address copied" : "Copy address"}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
        onClick={handleCopy}
        type="button"
      >
        {copied ? <Check aria-hidden="true" className="size-4 text-teal-600" /> : <Copy aria-hidden="true" className="size-4" />}
      </button>
    </div>
  );
}
