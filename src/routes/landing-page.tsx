import { Link } from "react-router-dom";

const exampleAddresses = ["vitalik.eth", "pranksy.eth", "punk6529.eth", "cozomo.eth"];

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Wallet as Gallery
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Explore any wallet as a gallery
        </h1>
        <div className="mt-8 rounded-lg border bg-white/70 p-4 text-left shadow-sm backdrop-blur dark:bg-slate-950/60">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="wallet-address">
            Wallet address or ENS
          </label>
          <input
            id="wallet-address"
            className="mt-2 w-full rounded-md border bg-transparent px-4 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="vitalik.eth or 0x..."
            type="text"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Address validation and navigation will be implemented in Phase 3.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {exampleAddresses.map((address) => (
            <Link
              className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground transition hover:border-accent hover:text-foreground"
              key={address}
              to={`/${address}`}
            >
              {address}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
