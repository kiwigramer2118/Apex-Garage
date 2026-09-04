import Link from "next/link";
import { CalendarCheck, Tag, Wrench, Timer } from "lucide-react";
import type { ActivityItem } from "@/types";
import { getEventById, getListingById, getCarById } from "@/lib/data";
import { timeAgo } from "@/lib/utils";

function resolveActivity(item: ActivityItem): { text: string; href: string } | null {
  switch (item.type) {
    case "rsvp": {
      const event = getEventById(item.targetId);
      if (!event) return null;
      return { text: `RSVP'd to ${event.title}`, href: `/events/${event.id}` };
    }
    case "listing": {
      const listing = getListingById(item.targetId);
      if (!listing) return null;
      return { text: `Published ${listing.title}`, href: `/classifieds/${listing.id}` };
    }
    case "car-update": {
      const car = getCarById(item.targetId);
      if (!car) return null;
      return { text: `Updated ${car.nickname}'s garage`, href: `/cars/${car.id}` };
    }
    case "lap-time": {
      const car = getCarById(item.targetId);
      if (!car) return null;
      return { text: `New lap time set with ${car.nickname}`, href: `/cars/${car.id}` };
    }
    default:
      return null;
  }
}

const ICONS: Record<ActivityItem["type"], typeof CalendarCheck> = {
  rsvp: CalendarCheck,
  listing: Tag,
  "car-update": Wrench,
  "lap-time": Timer,
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return <p className="text-body text-text-muted">No recent activity.</p>;
  }

  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => {
        const resolved = resolveActivity(item);
        if (!resolved) return null;
        const Icon = ICONS[item.type];
        return (
          <li key={item.id}>
            <Link
              href={resolved.href}
              className="flex items-center gap-3 rounded-button px-2 py-3 transition-colors duration-150 hover:bg-surface-2"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-text-secondary">
                <Icon size={15} strokeWidth={1.75} />
              </span>
              <span className="flex-1 text-body text-text-secondary">{resolved.text}</span>
              <span className="text-caption text-text-muted">{timeAgo(item.createdAt)}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
