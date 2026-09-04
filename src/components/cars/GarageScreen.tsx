import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import { getUserById, getCarsByOwner, CURRENT_USER_ID } from "@/lib/data";
import { Avatar } from "@/components/ui/Avatar";
import { GarageSection } from "./GarageSection";

// The dedicated Garage screen — car collection ONLY. No bio, cover photo,
// followers, or settings; that identity/account content lives exclusively
// in UserProfileScreen. Reused for both "my" garage (/garage) and viewing
// another member's garage (/garage/[userId], linked from car pins etc.),
// so the only own-profile-only affordance is the "Add car" button.
export function GarageScreen({ userId }: { userId: string }) {
  const user = getUserById(userId);
  if (!user) notFound();

  const isOwnProfile = user.id === CURRENT_USER_ID;
  const myCars = getCarsByOwner(user.id);

  return (
    <div className="mx-auto max-w-2xl px-5 pb-10 pt-[calc(env(safe-area-inset-top)+20px)] lg:pt-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {!isOwnProfile && (
            <Link
              href={`/profile/${user.id}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-1 text-text-primary transition-colors duration-150 hover:bg-surface-2"
              aria-label="Back to profile"
            >
              <ChevronLeft size={19} strokeWidth={1.75} />
            </Link>
          )}
          {!isOwnProfile && <Avatar alt={user.name} size={36} />}
          <div className="min-w-0">
            <h1 className="truncate font-display text-title text-text-primary">
              {isOwnProfile ? "Garage" : `${user.name}’s garage`}
            </h1>
            <p className="text-caption text-text-muted">
              {myCars.length} {myCars.length === 1 ? "car" : "cars"}
            </p>
          </div>
        </div>

        {isOwnProfile && (
          <button
            type="button"
            className="flex shrink-0 items-center gap-1.5 rounded-button bg-accent px-4 py-2.5 text-caption text-onaccent transition-colors duration-150 hover:bg-accent-hover"
          >
            <Plus size={15} strokeWidth={2} />
            Add car
          </button>
        )}
      </div>

      <GarageSection cars={myCars} featuredCarId={user.featuredCarId} />
    </div>
  );
}
