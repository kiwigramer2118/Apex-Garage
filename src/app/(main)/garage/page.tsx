import { getCurrentUser, getCarsByOwner, getActivityForUser } from "@/lib/data";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { CarCarousel } from "@/components/cars/CarCarousel";
import { ActivityFeed } from "@/components/profile/ActivityFeed";

export default function GaragePage() {
  const user = getCurrentUser();
  const myCars = getCarsByOwner(user.id);
  const activity = getActivityForUser(user.id);

  return (
    <div className="mx-auto max-w-2xl px-5 pb-10">
      <ProfileHeader
        user={user}
        stats={[
          { label: "Autos", value: myCars.length },
          { label: "Seguidores", value: user.followerCount },
          { label: "Siguiendo", value: user.followingCount },
        ]}
      />

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-heading text-text-primary">Mi Garage</h2>
        </div>
        <CarCarousel cars={myCars} />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-heading text-text-primary">Actividad</h2>
        <ActivityFeed items={activity} />
      </section>
    </div>
  );
}
