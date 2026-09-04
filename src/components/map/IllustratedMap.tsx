"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Car as CarIcon, Clock, Compass, MapPin, Minus, Plus, RotateCcw } from "lucide-react";
import type { Car, TrackEvent } from "@/types";
import { cars, getUserById, tracks, EVENT_CATEGORY_LABEL, CAR_STATUS_LABEL } from "@/lib/data";
import { CITY_COORDS, makeProjector } from "@/lib/geo";
import { CATEGORY_COLOR } from "./EventPin";
import { FloatingMapCard } from "./FloatingMapCard";
import { Badge } from "@/components/ui/Badge";
import { Avatar, StackedAvatars } from "@/components/ui/Avatar";
import { RSVPButton } from "@/components/events/RSVPButton";
import { formatDate, formatPrice, formatTime } from "@/lib/utils";

const MIN_SCALE = 0.8;
const MAX_SCALE = 2.6;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

interface IllustratedMapProps {
  events: TrackEvent[];
  activeEventIds: Set<string>;
  selectedEventId: string | null;
  onSelectEvent: (id: string | null) => void;
}

export function IllustratedMap({ events, activeEventIds, selectedEventId, onSelectEvent }: IllustratedMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const [openPin, setOpenPin] = useState<{ kind: "event" | "car"; id: string; anchor: { x: number; y: number } } | null>(
    null
  );
  const eventPinRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Cars placed on the map by their owner's general SoCal location — real
  // approximate city coordinates, not a specific address. Gives the map
  // "diverse key points" beyond just events, per spec.
  const carPoints = useMemo(
    () =>
      cars
        .map((car) => {
          const owner = getUserById(car.ownerId);
          const coords = owner ? CITY_COORDS[owner.location] : undefined;
          return coords ? { car, owner, ...coords } : null;
        })
        .filter((v): v is { car: Car; owner: NonNullable<ReturnType<typeof getUserById>>; lat: number; lng: number } => !!v),
    []
  );

  const project = useMemo(() => {
    const points = [
      ...tracks.map((t) => ({ lat: t.lat, lng: t.lng })),
      ...events.map((e) => ({ lat: e.lat, lng: e.lng })),
      ...carPoints.map((c) => ({ lat: c.lat, lng: c.lng })),
    ];
    return makeProjector(points, 14);
  }, [events, carPoints]);

  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: r.width, height: r.height });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  function clampPan(next: { x: number; y: number }, s: number) {
    const maxX = containerSize.width * 0.35 * s;
    const maxY = containerSize.height * 0.35 * s;
    return { x: clamp(next.x, -maxX, maxX), y: clamp(next.y, -maxY, maxY) };
  }

  function handlePointerDown(e: React.PointerEvent) {
    draggingRef.current = true;
    movedRef.current = false;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) {
      movedRef.current = true;
      if (openPin) setOpenPin(null);
    }
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan((p) => clampPan({ x: p.x + dx, y: p.y + dy }, scale));
  }

  function handlePointerUp() {
    draggingRef.current = false;
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    setOpenPin(null);
    const delta = -e.deltaY * 0.0012;
    setScale((s) => clamp(s + delta, MIN_SCALE, MAX_SCALE));
  }

  function zoomBy(delta: number) {
    setOpenPin(null);
    setScale((s) => clamp(s + delta, MIN_SCALE, MAX_SCALE));
  }

  function resetView() {
    setOpenPin(null);
    setScale(1);
    setPan({ x: 0, y: 0 });
  }

  function handlePinClick(e: React.MouseEvent, kind: "event" | "car", id: string) {
    e.stopPropagation();
    if (movedRef.current) return;
    const pinRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current!.getBoundingClientRect();
    const anchor = {
      x: pinRect.left + pinRect.width / 2 - containerRect.left,
      y: pinRect.top + pinRect.height / 2 - containerRect.top,
    };
    setOpenPin({ kind, id, anchor });
    if (kind === "event") onSelectEvent(id);
  }

  // Deep-link support: when `selectedEventId` arrives from outside (e.g. the
  // "Ver en mapa" link on an event detail page), open that pin's floating
  // card automatically instead of requiring a manual click.
  useEffect(() => {
    if (!selectedEventId) return;
    if (openPin?.kind === "event" && openPin.id === selectedEventId) return;
    const el = eventPinRefs.current.get(selectedEventId);
    if (!el || !containerRef.current) return;
    const pinRect = el.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    setOpenPin({
      kind: "event",
      id: selectedEventId,
      anchor: {
        x: pinRect.left + pinRect.width / 2 - containerRect.left,
        y: pinRect.top + pinRect.height / 2 - containerRect.top,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEventId, containerSize]);

  const trackPositions = tracks.map((t) => ({ track: t, ...project({ lat: t.lat, lng: t.lng }) }));
  const selectedEvent = openPin?.kind === "event" ? events.find((e) => e.id === openPin.id) : null;
  const selectedCarPoint = openPin?.kind === "car" ? carPoints.find((c) => c.car.id === openPin.id) : null;

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full touch-none overflow-hidden bg-bg"
      style={{ cursor: draggingRef.current ? "grabbing" : "grab" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
    >
      <motion.div
        className="absolute inset-[-12%]"
        animate={{ x: pan.x, y: pan.y, scale }}
        transition={{ type: "tween", duration: draggingRef.current ? 0 : 0.08 }}
      >
        <MapBackdrop trackPositions={trackPositions} />

        {/* Track landmarks */}
        {trackPositions.map(({ track, xPct, yPct }) => (
          <div
            key={track.id}
            className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: `${xPct}%`, top: `${yPct}%` }}
          >
            <span className="h-2 w-2 rounded-full bg-text-muted/70 ring-4 ring-text-muted/10" />
            <span className="rounded-pill border border-border/80 bg-surface-1/70 px-2 py-0.5 text-[10px] uppercase tracking-wider text-text-muted backdrop-blur-sm">
              {track.shortName}
            </span>
          </div>
        ))}

        {/* Car / garage pins */}
        {carPoints.map(({ car, owner, lat, lng }, i) => {
          const { xPct, yPct } = project({ lat, lng });
          return (
            <motion.button
              key={car.id}
              type="button"
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${xPct}%`, top: `${yPct}%` }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.24, delay: 0.15 + i * 0.03, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.12 }}
              onClick={(e) => handlePinClick(e, "car", car.id)}
              aria-label={`${car.make} ${car.model} — ${owner.name}`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-[10px] border border-border bg-surface-2 text-text-secondary shadow-[0_2px_10px_rgba(0,0,0,0.14)]">
                <CarIcon size={13} strokeWidth={1.75} />
              </span>
            </motion.button>
          );
        })}

        {/* Event pins */}
        {events.map((event, i) => {
          const { xPct, yPct } = project({ lat: event.lat, lng: event.lng });
          const color = CATEGORY_COLOR[event.category];
          const isActive = activeEventIds.has(event.id);
          const isSelected = event.id === selectedEventId;
          return (
            <motion.button
              key={event.id}
              ref={(el) => {
                if (el) eventPinRefs.current.set(event.id, el);
              }}
              type="button"
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${xPct}%`, top: `${yPct}%`, zIndex: isSelected ? 10 : 2 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: isActive ? 1 : 0.22,
                scale: 1,
                filter: isSelected ? `drop-shadow(0 0 6px ${color}99)` : "none",
              }}
              transition={{ duration: 0.24, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.25 }}
              onClick={(e) => handlePinClick(e, "event", event.id)}
              aria-label={event.title}
            >
              {event.isLive && (
                <span
                  className="absolute h-3.5 w-3.5 rounded-full animate-pulse-live"
                  style={{ background: color }}
                />
              )}
              <span
                className="relative h-3.5 w-3.5 rounded-full border-2 border-bg shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
                style={{ background: color }}
              />
            </motion.button>
          );
        })}
      </motion.div>

      {/* Zoom controls */}
      <div className="pointer-events-auto absolute bottom-5 right-4 z-20 flex flex-col overflow-hidden rounded-card border border-border bg-surface-1/90 backdrop-blur-md">
        <button
          type="button"
          onClick={() => zoomBy(0.3)}
          className="flex h-9 w-9 items-center justify-center text-text-secondary transition-colors duration-150 hover:text-text-primary"
          aria-label="Acercar"
        >
          <Plus size={16} strokeWidth={1.75} />
        </button>
        <div className="h-px bg-border" />
        <button
          type="button"
          onClick={() => zoomBy(-0.3)}
          className="flex h-9 w-9 items-center justify-center text-text-secondary transition-colors duration-150 hover:text-text-primary"
          aria-label="Alejar"
        >
          <Minus size={16} strokeWidth={1.75} />
        </button>
        <div className="h-px bg-border" />
        <button
          type="button"
          onClick={resetView}
          className="flex h-9 w-9 items-center justify-center text-text-secondary transition-colors duration-150 hover:text-text-primary"
          aria-label="Restablecer vista"
        >
          <RotateCcw size={13} strokeWidth={1.75} />
        </button>
      </div>

      {/* Illustrative-map disclosure */}
      <div className="pointer-events-none absolute bottom-5 left-4 z-20 flex items-center gap-1.5 rounded-pill border border-border/80 bg-surface-1/70 px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-text-muted backdrop-blur-sm">
        <Compass size={11} strokeWidth={1.75} />
        Vista ilustrada
      </div>

      <AnimatePresence>
        {selectedEvent && (
          <FloatingMapCard anchor={openPin!.anchor} containerSize={containerSize} onClose={() => setOpenPin(null)}>
            <EventCardBody event={selectedEvent} />
          </FloatingMapCard>
        )}
        {selectedCarPoint && (
          <FloatingMapCard anchor={openPin!.anchor} containerSize={containerSize} onClose={() => setOpenPin(null)}>
            <CarCardBody car={selectedCarPoint.car} owner={selectedCarPoint.owner} />
          </FloatingMapCard>
        )}
      </AnimatePresence>
    </div>
  );
}

function EventCardBody({ event }: { event: TrackEvent }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-28 w-full overflow-hidden bg-surface-2">
        <Image src={event.coverImage} alt={event.title} fill className="object-cover" sizes="296px" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-surface-1/10 to-transparent" />
      </div>
      <div className="flex flex-col gap-2.5 px-3.5 pb-3.5">
        <div className="flex items-center gap-1.5">
          <Badge tone="accent">{EVENT_CATEGORY_LABEL[event.category]}</Badge>
          {event.isLive && <Badge tone="success">● En vivo</Badge>}
        </div>
        <p className="line-clamp-2 font-display text-heading text-text-primary">{event.title}</p>
        <div className="flex items-center gap-1.5 text-caption text-text-secondary">
          <Clock size={13} className="shrink-0 text-text-muted" />
          <span>
            {formatDate(event.date)} · {formatTime(event.startTime)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <StackedAvatars
            avatars={event.attendeeIds.slice(0, 3).map((id) => ({ alt: getUserById(id)?.name ?? "" }))}
            extraCount={Math.max(event.attendeeIds.length - 3, 0)}
            size={22}
          />
          <span className="text-caption text-text-muted">{formatPrice(event.priceUsd)}</span>
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <RSVPButton eventId={event.id} full />
        </div>
        <Link
          href={`/events/${event.id}`}
          className="text-center text-caption text-text-muted underline underline-offset-2"
        >
          Ver detalle completo
        </Link>
      </div>
    </div>
  );
}

function CarCardBody({ car, owner }: { car: Car; owner: ReturnType<typeof getUserById> }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-28 w-full overflow-hidden bg-surface-2">
        <Image
          src={car.heroImage}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover"
          sizes="296px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-surface-1/10 to-transparent" />
      </div>
      <div className="flex flex-col gap-2.5 px-3.5 pb-3.5">
        <div className="flex items-center gap-1.5">
          <p className="text-[10px] uppercase tracking-wide text-text-muted">
            {car.year} · {car.chassisCode}
          </p>
          <Badge tone={car.status === "current" ? "success" : car.status === "project" ? "accent" : "muted"}>
            {CAR_STATUS_LABEL[car.status]}
          </Badge>
        </div>
        <p className="font-display text-heading text-text-primary">
          {car.make} {car.model}
        </p>
        {owner && (
          <Link href={`/profile/${owner.id}`} className="flex items-center gap-2">
            <Avatar alt={owner.name} size={22} />
            <span className="text-caption text-text-secondary underline-offset-2 hover:underline">{owner.name}</span>
          </Link>
        )}
        {car.bestLapTime && car.bestLapTrackId && (
          <div className="flex items-center gap-1.5 text-caption text-text-secondary">
            <MapPin size={13} className="shrink-0 text-text-muted" />
            <span>
              Mejor vuelta {car.bestLapTime} en {tracks.find((t) => t.id === car.bestLapTrackId)?.shortName}
            </span>
          </div>
        )}
        <div className="mt-1 flex gap-2">
          <Link
            href={`/cars/${car.id}`}
            className="flex-1 rounded-button bg-accent py-2.5 text-center text-caption text-onaccent transition-colors duration-150 hover:bg-accent-hover"
          >
            Ver auto
          </Link>
          {owner && (
            <Link
              href={`/profile/${owner.id}`}
              className="flex-1 rounded-button border border-border py-2.5 text-center text-caption text-text-primary transition-colors duration-150 hover:bg-surface-2"
            >
              Ver garage
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// Abstract, non-literal "map" backdrop: dot-grid texture, soft radar-style
// contour rings around each track landmark, and a winding glow route
// connecting them — reads as a stylized live map without pretending to be
// real cartography.
function MapBackdrop({
  trackPositions,
}: {
  trackPositions: { track: { id: string }; xPct: number; yPct: number }[];
}) {
  const routeD = useMemo(() => {
    if (trackPositions.length < 2) return "";
    const pts = trackPositions.map((p) => [p.xPct, p.yPct] as const);
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      const mx = (x0 + x1) / 2;
      d += ` Q ${mx} ${y0}, ${x1} ${y1}`;
    }
    return d;
  }, [trackPositions]);

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="apex-dot-grid" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="0.5" cy="0.5" r="0.35" fill="#16160F" fillOpacity="0.16" />
        </pattern>
        <radialGradient id="apex-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B3F22C" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#B3F22C" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="100" height="100" fill="#F1F1E8" />
      <rect width="100" height="100" fill="url(#apex-dot-grid)" />

      {trackPositions.map(({ track, xPct, yPct }) => (
        <g key={track.id}>
          <circle cx={xPct} cy={yPct} r="16" fill="url(#apex-glow)" />
          {[5, 9, 13].map((r) => (
            <circle key={r} cx={xPct} cy={yPct} r={r} fill="none" stroke="#16160F" strokeOpacity="0.12" strokeWidth="0.2" />
          ))}
        </g>
      ))}

      {routeD && (
        <path
          d={routeD}
          fill="none"
          stroke="#4B6B12"
          strokeOpacity="0.35"
          strokeWidth="0.35"
          strokeDasharray="1.2 1.4"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
