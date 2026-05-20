import { Link, useParams } from "react-router-dom";

export default function GalleryPage() {
  const { address } = useParams();
  const displayAddress = address ?? "unknown wallet";

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-10 text-white">
      <section className="w-full max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-200">
          Gallery Mode
        </p>
        <h1 className="mt-4 break-all text-4xl font-semibold tracking-tight">{displayAddress}</h1>
        <p className="mt-4 text-neutral-300">
          The R3F scene, gallery room, NFT frames, and controls will be implemented in Phase 6.
        </p>
        <Link
          className="mt-8 inline-flex h-10 items-center justify-center rounded-md border border-white/20 px-4 text-sm font-medium transition hover:border-teal-200 hover:text-teal-100"
          to={`/${displayAddress}`}
        >
          Exit
        </Link>
      </section>
    </main>
  );
}
