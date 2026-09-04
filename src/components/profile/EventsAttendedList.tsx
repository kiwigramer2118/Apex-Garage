import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { TrackEvent } from "@/types";
import { EVENT_CATEGORY_LABEL, getTrackById } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

// History, not a points tally — a plain list of events attended, not a
// counter or leaderboard position.
export function EventsAttendedList({ events }: { events: TrackEvent[] }) {
  if (events.length === 0) {
    return <p className="text-body text-text-muted">Todavía no asiste a eventos.</p>;
  }

  return (
    <ul className="flex flex-col gap-1">
      {events.map((event) => {
        const track = getTrackById(event.trackId);
        return (
          <li key={event.id}>
            <Link
              href={`/events/${event.id}`}
              className="flex items-center gap-3 rounded-button px-2 py-3 transition-colors duration-150 hover:bg-surface-2"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-text-secondary">
                <CalendarDays size={15} strokeWidth={1.75} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block truncate text-body text-text-secondary">{event.title}</span>
                <span className="block text-caption text-text-muted">
                  {formatDate(event.date)} · {track?.shortName ?? "SoCal"}
                </span>
              </span>
              <Badge tone="muted">{EVENT_CATEGORY_LABEL[event.category]}</Badge>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
