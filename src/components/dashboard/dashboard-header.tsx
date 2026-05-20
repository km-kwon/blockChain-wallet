import { GalleryHorizontalEnd } from "lucide-react";
import { Link } from "react-router-dom";
import AddressAvatar from "@/components/shared/address-avatar";
import AddressDisplay from "@/components/shared/address-display";
import ShareButton from "@/components/shared/share-button";
import ThemeToggle from "@/components/shared/theme-toggle";
import type { EnsProfile } from "@/types/wallet";

type DashboardHeaderProps = {
  profile: EnsProfile;
  routeAddress: string;
};

export default function DashboardHeader({ profile, routeAddress }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <AddressAvatar profile={profile} size="lg" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">Wallet dashboard</p>
          <h1 className="mt-1 truncate text-3xl font-semibold tracking-tight">{profile.displayName}</h1>
          <div className="mt-3 max-w-full">
            <AddressDisplay address={profile.resolvedAddress} />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/30"
          to={`/${routeAddress}/gallery`}
        >
          <GalleryHorizontalEnd aria-hidden="true" className="size-4" />
          Enter Gallery
        </Link>
        <ThemeToggle />
        <ShareButton
          text={`Explore ${profile.displayName} as a wallet gallery.`}
          title={`${profile.displayName} on Wallet as Gallery`}
        />
      </div>
    </header>
  );
}
