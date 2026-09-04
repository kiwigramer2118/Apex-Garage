"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Clock, MapPin, User as UserIcon } from "lucide-react";
import { events as mockEvents, getTrackById, getUserById, EVENT_CATEGORY_LABEL } from "@/lib/data";
import { useAppStore } from "@/store/useAppStore";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { RSVPButton } from "@/components/events/RSVPButton";
import { AttendeeList } from "@/components/events/AttendeeList";
import { formatDateLong, formatTime, formatPrice } from "@/lib/utils";

export function EventDetailScreen({ eventId }: { eventId: string }) {
  const createdEvents = useAppStore((s) => s.createdEvents);
  // Merged lookup: events published via the Create flow only ever live in
  // the (session-only) store, never in the static mock JSON, so a detail
  // page has to check both — this is also why this screen is a Client
  // Component instead of resolving the event on the server.
  const event = useMemo(
    () => [...createdEvents, ...mockEvents].find((e) => e.id === eventId),
    [createdEvents, eventId]
  );

  if (!event) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-body text-text-secondary">No encontramos este evento.</p>
        <Link href="/" className="text-caption text-accent underline underline-offset-2">
          Volver al mapa
        </Link>
      </div>
    );
  }

  const track = getTrackById(event.trackId);
  const host = getUserById(event.hostId);

  return (
    <div className="pb-10">
      <div className="relative h-56 w-full overflow-hidden lg:h-72">
        <Image src={event.coverImage} alt={event.title} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-bg/40" />
        <Link
          href="/"
          className="absolute left-4 top-[calc(env(safe-area-inset-top)+16px)] flex h-9 w-9 items-center justify-center rounded-full bg-surface-1/80 text-text-primary backdrop-blur-md"
        >
          <ChevronLeft size={19} strokeWidth={1.75} />
        </Link>
      </div>

      <div className="mx-auto max-w-2xl px-5 pt-5">
        <div className="mb-2 flex items-center gap-2">
          <Badge tone="accent">{EVENT_CATEGORY_LABEL[event.category]}</Badge>
          {event.isLive && <Badge tone="success">● En vivo ahora</Badge>}
        </div>
        <h1 className="font-display text-title text-text-primary">{event.title}</h1>

        <div className="mt-5 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-body text-text-secondary">
            <Clock size={17} className="shrink-0 text-text-muted" strokeWidth={1.75} />
            <span>
              {formatDateLong(event.date)} · {formatTime(event.startTime)} – {formatTime(event.endTime)}
            </span>
          </div>
          <Link
            href={`/?event=${event.id}`}
            className="flex items-center gap-3 text-body text-text-secondary transition-colors duration-150 hover:text-text-primary"
          >
            <MapPin size={17} className="shrink-0 text-text-muted" strokeWidth={1.75} />
            <span className="flex-1">{track ? `${track.name}, ${track.city}` : "SoCal"}</span>
            <span className="text-caption text-accent">Ver en mapa</span>
          </Link>
          {host && (
            <div className="flex items-center gap-3 text-body text-text-secondary">
              <UserIcon size={17} className="shrink-0 text-text-muted" strokeWidth={1.75} />
              <span>
                Organiza <span className="text-text-primary">{host.name}</span>
              </span>
            </div>
          )}
        </div>

        {host && (
          <Link href="#" className="mt-4 flex items-center gap-3 rounded-card border border-border bg-surface-1 p-3">
            <Avatar src={host.avatar} alt={host.name} size={40} />
            <div>
              <p className="text-body text-text-primary">{host.name}</p>
              <p className="text-caption text-text-muted">@{host.handle}</p>
            </div>
          </Link>
        )}

        <div className="mt-6">
          <h2 className="mb-2 text-heading text-text-primary">Sobre el evento</h2>
          <p className="text-body leading-relaxed text-text-secondary">{event.description}</p>
        </div>

        <div className="mt-6">
          <h2 className="mb-3 text-heading text-text-primary">Asistentes</h2>
          <AttendeeList attendeeIds={event.attendeeIds} capacity={event.capacity} />
        </div>

        <div className="mt-8 flex items-center gap-3 border-t border-border pt-5">
          <div className="flex-1">
            <p className="text-caption text-text-muted">Entrada</p>
            <p className="font-display text-heading text-text-primary">{formatPrice(event.priceUsd)}</p>
          </div>
          <RSVPButton eventId={event.id} />
        </div>
      </div>
    </div>
  );
}
