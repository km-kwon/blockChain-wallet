import { Link, useParams } from "react-router-dom";

export default function DashboardPage() {
  const { address } = useParams();
  const displayAddress = address ?? "unknown wallet";

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
            to={`/${displayAddress}/gallery`}
          >
            Enter Gallery
          </Link>
        </div>
        <div className="grid gap-4 py-8 md:grid-cols-4">
          {["Total Value", "24h Change", "Tokens", "NFTs"].map((label) => (
            <article className="rounded-lg border bg-white/70 p-5 shadow-sm dark:bg-slate-950/60" key={label}>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-3 text-2xl font-semibold">Phase 2</p>
            </article>
          ))}
        </div>
        <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          Dashboard panels, charts, and activity states will be added after mock wallet data is defined.
        </p>
      </section>
    </main>
  );
}
