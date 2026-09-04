"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { events as mockEvents } from "@/lib/data";
import { useAppStore } from "@/store/useAppStore";
import { FilterChips } from "./FilterChips";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { EventSheetContent } from "./EventSheetContent";
import { IllustratedMap } from "./IllustratedMap";
import { OnboardingBanner } from "@/components/onboarding/OnboardingBanner";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const LiveMap = dynamic(() => import("./LiveMap").then((m) => m.LiveMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-surface-1" />,
});

export function MapScreen() {
  const activeFilters = useAppStore((s) => s.activeFilters);
  const toggleFilter = useAppStore((s) => s.toggleFilter);
  const selectedEventId = useAppStore((s) => s.selectedEventId);
  const setSelectedEventId = useAppStore((s) => s.setSelectedEventId);
  const createdEvents = useAppStore((s) => s.createdEvents);
  const allEvents = useMemo(() => [...createdEvents, ...mockEvents], [createdEvents]);

  const searchParams = useSearchParams();
  useEffect(() => {
    const eventId = searchParams.get("event");
    if (eventId) setSelectedEventId(eventId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const activeEventIds = useMemo(() => {
    if (activeFilters.length === 0) return new Set(allEvents.map((e) => e.id));
    return new Set(allEvents.filter((e) => activeFilters.includes(e.category)).map((e) => e.id));
  }, [activeFilters, allEvents]);

  const liveCount = useMemo(() => allEvents.filter((e) => e.isLive).length, [allEvents]);
  const selectedEvent = allEvents.find((e) => e.id === selectedEventId) ?? null;

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      {MAPBOX_TOKEN ? (
        <LiveMap
          events={allEvents}
          activeEventIds={activeEventIds}
          selectedEventId={selectedEventId}
          onSelectEvent={setSelectedEventId}
        />
      ) : (
        <IllustratedMap
          events={allEvents}
          activeEventIds={activeEventIds}
          selectedEventId={selectedEventId}
          onSelectEvent={(id) => setSelectedEventId(id ?? null)}
        />
      )}

      {/* Floating UI over the map canvas */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-1 pt-[calc(env(safe-area-inset-top)+16px)]">
        <div className="pointer-events-auto mx-4 flex items-center gap-3 rounded-pill border border-border bg-surface-1/90 px-4 py-3 backdrop-blur-md">
          <Search size={17} className="text-text-muted" strokeWidth={1.75} />
          <span className="flex-1 text-body text-text-muted">Search events, tracks, garages…</span>
          {liveCount > 0 && (
            <span className="flex items-center gap-1.5 text-caption text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {liveCount} live
            </span>
          )}
        </div>
        <OnboardingBanner />
        <div className="pointer-events-auto">
          <FilterChips active={activeFilters} onToggle={toggleFilter} />
        </div>
      </div>

      {MAPBOX_TOKEN && (
        <BottomSheet open={!!selectedEvent} onClose={() => setSelectedEventId(null)}>
          {selectedEvent && <EventSheetContent event={selectedEvent} />}
        </BottomSheet>
      )}
    </div>
  );
}
