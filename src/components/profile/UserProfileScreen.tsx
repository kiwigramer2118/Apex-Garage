import { notFound } from "next/navigation";
import { Bell, Images, Lock, LogOut, ChevronRight, Users } from "lucide-react";
import { getUserById, getCarsByOwner, getFeaturedCar, getEventsAttendedBy, getActivityForUser, CURRENT_USER_ID } from "@/lib/data";
import { ProfileCoverHero } from "./ProfileCoverHero";
import { GarageSection } from "@/components/cars/GarageSection";
import { EventsAttendedList } from "./EventsAttendedList";
import { ActivityFeed } from "./ActivityFeed";
import { GalleryLightbox } from "@/components/cars/GalleryLightbox";

const SETTINGS = [
  { icon: Bell, label: "Notificaciones" },
  { icon: Lock, label: "Privacidad" },
  { icon: LogOut, label: "Cerrar sesión" },
];

// The single Profile + Garage screen — a Garage is a section of a Profile,
// never a separate entity, per spec. Used both for "my" profile (own tabs)
// and for viewing any other member's profile (car pins on the map, event
// hosts, listing sellers).
export function UserProfileScreen({ userId }: { userId: string }) {
  const user = getUserById(userId);
  if (!user) notFound();

  const isOwnProfile = user.id === CURRENT_USER_ID;
  const myCars = getCarsByOwner(user.id);
  const featuredCar = getFeaturedCar(user);
  const attendedEvents = getEventsAttendedBy(user.id);
  const activity = getActivityForUser(user.id);

  return (
    <div className="pb-10">
      <ProfileCoverHero
        user={user}
        isOwnProfile={isOwnProfile}
        stats={[
          { label: "Autos", value: myCars.length },
          { label: "Seguidores", value: user.followerCount },
          { label: "Siguiendo", value: user.followingCount },
        ]}
      />

      <div className="mx-auto max-w-2xl px-5">
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-heading text-text-primary">Garage</h2>
            {featuredCar && <span className="text-caption text-text-muted">{featuredCar.nickname} destacado</span>}
          </div>
          <GarageSection cars={myCars} featuredCarId={user.featuredCarId} />
        </section>

        {user.communities.length > 0 && (
          <section className="mt-8">
            <div className="mb-3 flex items-center gap-2">
              <Users size={16} className="text-text-muted" strokeWidth={1.75} />
              <h2 className="text-heading text-text-primary">Comunidades</h2>
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
              <h2 className="text-heading text-text-primary">Galería</h2>
            </div>
            <GalleryLightbox images={user.galleryImages} alt={user.name} />
          </section>
        )}

        <section className="mt-8">
          <h2 className="mb-3 text-heading text-text-primary">Eventos asistidos</h2>
          <EventsAttendedList events={attendedEvents} />
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-heading text-text-primary">Actividad reciente</h2>
          <ActivityFeed items={activity} />
        </section>

        {isOwnProfile && (
          <section className="mt-8">
            <h2 className="mb-3 text-heading text-text-primary">Cuenta</h2>
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

        <p className="mt-8 text-center text-caption text-text-muted">Apex Garage · PoC de portafolio</p>
      </div>
    </div>
  );
}
