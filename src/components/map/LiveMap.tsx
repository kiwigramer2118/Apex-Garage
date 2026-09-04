"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { TrackEvent } from "@/types";
import { createEventPinElement } from "./EventPin";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Centered over the SoCal track triangle (Buttonwillow / Willow Springs / Chuckwalla).
const INITIAL_CENTER: [number, number] = [-117.9, 34.3];
const INITIAL_ZOOM = 6.4;

interface LiveMapProps {
  events: TrackEvent[];
  activeEventIds: Set<string>; // events that pass the current filter (visually emphasized)
  selectedEventId: string | null;
  onSelectEvent: (id: string) => void;
}

export function LiveMap({ events, activeEventIds, selectedEventId, onSelectEvent }: LiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const loadedRef = useRef(false);
  const eventsRef = useRef(events);
  eventsRef.current = events;
  const onSelectRef = useRef(onSelectEvent);
  onSelectRef.current = onSelectEvent;

  // Reconciles markers on the map with the current `events` list — adds new
  // ones (with a staggered fade+scale entrance) and removes ones that were
  // filtered out at the source, e.g. after the Create flow publishes a new
  // event this picks it up without a full remount.
  function syncMarkers() {
    const map = mapRef.current;
    if (!map) return;
    const current = eventsRef.current;
    const currentIds = new Set(current.map((e) => e.id));

    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    current.forEach((event, i) => {
      if (markersRef.current.has(event.id)) return;
      const el = createEventPinElement({
        category: event.category,
        isLive: event.isLive,
        delayMs: i * 35,
      });
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectRef.current(event.id);
      });
      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([event.lng, event.lat])
        .addTo(map);
      markersRef.current.set(event.id, marker);
    });
  }

  // Initialize the map once.
  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      attributionControl: false,
      pitchWithRotate: false,
      dragRotate: false,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

    map.on("load", () => {
      loadedRef.current = true;
      syncMarkers();
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      loadedRef.current = false;
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-sync whenever the event list changes (e.g. a new one is published).
  useEffect(() => {
    if (!loadedRef.current) return;
    syncMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  // Fade non-matching pins in/out when filters change (no hard cut).
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      const isActive = activeEventIds.has(id);
      el.style.opacity = isActive ? "1" : "0.22";
      el.style.pointerEvents = isActive ? "auto" : "none";
    });
  }, [activeEventIds, events]);

  // Highlight the selected pin and fly to it.
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      el.style.zIndex = id === selectedEventId ? "10" : "1";
      el.style.filter =
        id === selectedEventId ? "drop-shadow(0 0 6px rgba(179,242,44,0.7))" : "none";
    });

    if (!selectedEventId || !mapRef.current) return;
    const event = events.find((e) => e.id === selectedEventId);
    if (!event) return;
    mapRef.current.flyTo({
      center: [event.lng, event.lat],
      zoom: Math.max(mapRef.current.getZoom(), 10.5),
      duration: 700,
      essential: true,
    });
  }, [selectedEventId, events]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-surface-1 px-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-subtle text-accent-ink">
          <span className="text-heading">◎</span>
        </div>
        <p className="max-w-xs text-body text-text-secondary">
          Agrega tu Mapbox token en{" "}
          <code className="rounded bg-surface-3 px-1.5 py-0.5 text-caption text-text-primary">
            .env.local
          </code>{" "}
          como <code className="rounded bg-surface-3 px-1.5 py-0.5 text-caption text-text-primary">NEXT_PUBLIC_MAPBOX_TOKEN</code> para ver el mapa en vivo.
        </p>
        <a
          href="https://account.mapbox.com/access-tokens/"
          target="_blank"
          rel="noreferrer"
          className="text-caption text-accent-ink underline underline-offset-2"
        >
          Obtener un token gratis
        </a>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
