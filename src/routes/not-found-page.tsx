import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-md rounded-lg border bg-white/75 p-6 text-center shadow-sm dark:bg-slate-950/60">
        <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <SearchX aria-hidden="true" className="size-5" />
        </div>
        <p className="mt-5 text-sm font-medium text-teal-700 dark:text-teal-300">Route not found</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">This room is not in the gallery</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Enter an ENS name or Ethereum address to open a wallet dashboard.
        </p>
        <Link
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/30"
          to="/"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back home
        </Link>
      </section>
    </main>
  );
}
