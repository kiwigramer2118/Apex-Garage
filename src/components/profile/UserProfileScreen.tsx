import { notFound } from "next/navigation";
import { Bell, Images, Link2, Lock, LogOut, ChevronRight, Users } from "lucide-react";
import { getUserById, getCarsByOwner, getEventsAttendedBy, getActivityForUser, CURRENT_USER_ID } from "@/lib/data";
import { ProfileCoverHero } from "./ProfileCoverHero";
import { EventsAttendedList } from "./EventsAttendedList";
import { ActivityFeed } from "./ActivityFeed";
import { GalleryLightbox } from "@/components/cars/GalleryLightbox";

const SETTINGS = [
  { icon: Bell, label: "Notifications" },
  { icon: Link2, label: "Connected accounts" },
  { icon: Lock, label: "Privacy" },
  { icon: LogOut, label: "Log out" },
];

// The Profile screen — identity and account hub only. The car collection
// lives exclusively on the Garage screen (GarageScreen.tsx); this screen
// only ever surfaces a tappable "cars" count that links there, never the
// grid itself, so the two tabs never duplicate content. Used both for "my"
// profile (own tabs) and for viewing any other member's profile (car pins
// on the map, event hosts, listing sellers).
export function UserProfileScreen({ userId }: { userId: string }) {
  const user = getUserById(userId);
  if (!user) notFound();

  const isOwnProfile = user.id === CURRENT_USER_ID;
  const myCars = getCarsByOwner(user.id);
  const attendedEvents = getEventsAttendedBy(user.id);
  const activity = getActivityForUser(user.id);

  return (
    <div className="pb-10">
      <ProfileCoverHero
        user={user}
        isOwnProfile={isOwnProfile}
        stats={[
          { label: "Cars", value: myCars.length, href: isOwnProfile ? "/garage" : `/garage/${user.id}` },
          { label: "Followers", value: user.followerCount },
          { label: "Following", value: user.followingCount },
        ]}
      />

      <div className="mx-auto max-w-2xl px-5">
        {user.communities.length > 0 && (
          <section className="mt-8">
            <div className="mb-3 flex items-center gap-2">
              <Users size={16} className="text-text-muted" strokeWidth={1.75} />
              <h2 className="text-heading text-text-primary">Communities</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.communities.map((c) => (
                <span
                  key={c}
                  className="rounded-pill border border-border bg-surface-1 px-3.5 py-2 text-caption text-text-secondary"
                >
                  {c}
                </span>
              ))}
            </div>
          </section>
        )}

        {user.galleryImages.length > 0 && (
          <section className="mt-8">
            <div className="mb-3 flex items-center gap-2">
              <Images size={16} className="text-text-muted" strokeWidth={1.75} />
              <h2 className="text-heading text-text-primary">Gallery</h2>
            </div>
            <GalleryLightbox images={user.galleryImages} alt={user.name} />
          </section>
        )}

        <section className="mt-8">
          <h2 className="mb-3 text-heading text-text-primary">Events attended</h2>
          <EventsAttendedList events={attendedEvents} />
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-heading text-text-primary">Recent activity</h2>
          <ActivityFeed items={activity} />
        </section>

        {isOwnProfile && (
          <section className="mt-8">
            <h2 className="mb-3 text-heading text-text-primary">Account</h2>
            <div className="overflow-hidden rounded-card border border-border">
              {SETTINGS.map((item, i) => (
                <button
                  key={item.label}
                  type="button"
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left text-body text-text-secondary transition-colors duration-150 hover:bg-surface-2 ${
                    i !== SETTINGS.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <item.icon size={17} strokeWidth={1.75} className="text-text-muted" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight size={16} className="text-text-muted" />
                </button>
              ))}
            </div>
          </section>
        )}

        <p className="mt-8 text-center text-caption text-text-muted">Apex Garage · Portfolio PoC</p>
      </div>
    </div>
  );
}
