import { Link } from "react-router-dom";

type ExampleChipsProps = {
  examples: string[];
};

export default function ExampleChips({ examples }: ExampleChipsProps) {
  return (
    <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Example wallets">
      {examples.map((address) => (
        <Link
          className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground transition hover:border-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
          key={address}
          to={`/${encodeURIComponent(address)}`}
        >
          {address}
        </Link>
      ))}
    </div>
  );
}
