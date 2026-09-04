import { MapPin } from "lucide-react";
import type { User } from "@/types";
import { Avatar } from "@/components/ui/Avatar";

export function ProfileHeader({
  user,
  stats,
}: {
  user: User;
  stats: { label: string; value: string | number }[];
}) {
  return (
    <div className="flex flex-col items-center gap-4 pt-8 text-center">
      <Avatar src={user.avatar} alt={user.name} size={88} />
      <div>
        <h1 className="font-display text-title text-text-primary">{user.name}</h1>
        <p className="text-body text-text-muted">@{user.handle}</p>
      </div>
      <p className="max-w-sm text-body text-text-secondary">{user.bio}</p>
      <div className="flex items-center gap-1 text-caption text-text-muted">
        <MapPin size={13} />
        {user.location}
      </div>

      <div className="mt-2 flex w-full max-w-sm items-stretch justify-around rounded-card border border-border bg-surface-1 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-0.5">
            <span className="font-display text-heading text-text-primary">{s.value}</span>
            <span className="text-caption text-text-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
