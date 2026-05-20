import { Check, Share2 } from "lucide-react";
import { useState } from "react";

type ShareButtonProps = {
  title: string;
  text: string;
};

export default function ShareButton({ title, text }: ShareButtonProps) {
  const [shared, setShared] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
      }

      setShared(true);
      window.setTimeout(() => setShared(false), 1400);
    } catch {
      setShared(false);
    }
  }

  return (
    <button
      aria-label={shared ? "Share link copied" : "Share wallet"}
      className="inline-flex size-10 items-center justify-center rounded-md border bg-white/70 text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 dark:bg-slate-950/60"
      onClick={handleShare}
      type="button"
    >
      {shared ? <Check aria-hidden="true" className="size-4 text-teal-600" /> : <Share2 aria-hidden="true" className="size-4" />}
    </button>
  );
}
