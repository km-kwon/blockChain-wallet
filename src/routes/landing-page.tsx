import AddressInput from "@/components/landing/address-input";
import ExampleChips from "@/components/landing/example-chips";

const exampleAddresses = ["vitalik.eth", "pranksy.eth", "punk6529.eth", "cozomo.eth"];

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-xl text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-md border bg-white/75 text-lg font-semibold shadow-sm dark:bg-slate-950/60">
          WG
        </div>
        <p className="mt-5 text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Explore any wallet as a gallery
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Wallet as Gallery
        </h1>
        <AddressInput />
        <ExampleChips examples={exampleAddresses} />
      </section>
    </main>
  );
}
