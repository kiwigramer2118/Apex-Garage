import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import type { TrackEvent } from "@/types";
import { EVENT_CATEGORY_LABEL, getTrackById, getUserById } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { RSVPButton } from "@/components/events/RSVPButton";
import { StackedAvatars } from "@/components/ui/Avatar";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";

export function EventSheetContent({ event }: { event: TrackEvent }) {
  const track = getTrackById(event.trackId);
  const attendees = event.attendeeIds.slice(0, 4).map((id) => {
    const u = getUserById(id);
    return { src: u?.avatar ?? "", alt: u?.name ?? "" };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="relative -mx-5 -mt-1 h-40 w-[calc(100%+40px)] overflow-hidden">
        <Image src={event.coverImage} alt={event.title} fill className="object-cover" sizes="440px" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-surface-1/10 to-transparent" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <Badge tone="accent">{EVENT_CATEGORY_LABEL[event.category]}</Badge>
            {event.isLive && <Badge tone="success">● En vivo</Badge>}
          </div>
          <h2 className="font-display text-title text-text-primary">{event.title}</h2>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-body text-text-secondary">
        <div className="flex items-center gap-2">
          <Clock size={16} className="shrink-0 text-text-muted" />
          <span>
            {formatDate(event.date)} · {formatTime(event.startTime)} – {formatTime(event.endTime)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="shrink-0 text-text-muted" />
          <span>{track ? track.name : "SoCal"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <StackedAvatars avatars={attendees} extraCount={Math.max(event.attendeeIds.length - attendees.length, 0)} />
        <span className="text-caption text-text-muted">
          {event.attendeeIds.length}/{event.capacity} confirmados
        </span>
      </div>

      <p className="text-caption text-text-secondary">{formatPrice(event.priceUsd)}</p>

      <div className="flex gap-2 pt-1">
        <RSVPButton eventId={event.id} full />
      </div>

      <Link
        href={`/events/${event.id}`}
        className="text-center text-caption text-text-muted underline underline-offset-2"
      >
        Ver detalle completo
      </Link>
    </div>
  );
}
