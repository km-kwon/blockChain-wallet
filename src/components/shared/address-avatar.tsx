import type { EnsProfile } from "@/types/wallet";

type AddressAvatarProps = {
  profile: EnsProfile;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "size-9 text-sm",
  md: "size-12 text-base",
  lg: "size-16 text-xl",
} as const;

export default function AddressAvatar({ profile, size = "md" }: AddressAvatarProps) {
  const initials = profile.displayName.slice(0, 2).toUpperCase();

  if (profile.avatarUrl) {
    return (
      <img
        alt={`${profile.displayName} avatar`}
        className={`${sizeClasses[size]} rounded-md border object-cover shadow-sm`}
        src={profile.avatarUrl}
      />
    );
  }

  return (
    <div
      aria-label={`${profile.displayName} avatar`}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-md border bg-muted font-semibold text-muted-foreground shadow-sm`}
    >
      {initials}
    </div>
  );
}
