import { Bell, Lock, LogOut, ChevronRight, Users } from "lucide-react";
import { getCurrentUser, getCarsByOwner } from "@/lib/data";
import { ProfileHeader } from "@/components/profile/ProfileHeader";

const COMMUNITIES = ["E46 Owners SoCal", "Buttonwillow Regulars", "Willow Springs Time Attack", "HB Cars & Coffee"];

const SETTINGS = [
  { icon: Bell, label: "Notificaciones" },
  { icon: Lock, label: "Privacidad" },
  { icon: LogOut, label: "Cerrar sesión" },
];

export default function ProfilePage() {
  const user = getCurrentUser();
  const myCars = getCarsByOwner(user.id);

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

      <button
        type="button"
        className="mt-6 w-full rounded-button border border-border py-3 text-body text-text-primary transition-colors duration-150 hover:bg-surface-2"
      >
        Editar perfil
      </button>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Users size={16} className="text-text-muted" strokeWidth={1.75} />
          <h2 className="text-heading text-text-primary">Comunidades</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMUNITIES.map((c) => (
            <span
              key={c}
              className="rounded-pill border border-border bg-surface-1 px-3.5 py-2 text-caption text-text-secondary"
            >
              {c}
            </span>
          ))}
        </div>
      </section>

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

      <p className="mt-8 text-center text-caption text-text-muted">Apex Garage · PoC de portafolio</p>
    </div>
  );
}
