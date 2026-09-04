import { create } from "zustand";
import type { EventCategory, TrackEvent, Listing } from "@/types";

interface AppState {
  // Map filters + selection
  activeFilters: EventCategory[];
  toggleFilter: (category: EventCategory) => void;
  clearFilters: () => void;

  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;

  // RSVP state, keyed by event id -> attending boolean (session-only, no backend)
  rsvps: Record<string, boolean>;
  toggleRsvp: (eventId: string) => void;

  // Items published from the Create flow. Session-only (no backend in this
  // PoC) — kept in the store so they immediately show up on the map /
  // classifieds grid without a page reload.
  createdEvents: TrackEvent[];
  addCreatedEvent: (event: TrackEvent) => void;

  createdListings: Listing[];
  addCreatedListing: (listing: Listing) => void;

  // Onboarding
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeFilters: [],
  toggleFilter: (category) =>
    set((state) => ({
      activeFilters: state.activeFilters.includes(category)
        ? state.activeFilters.filter((c) => c !== category)
        : [...state.activeFilters, category],
    })),
  clearFilters: () => set({ activeFilters: [] }),

  selectedEventId: null,
  setSelectedEventId: (id) => set({ selectedEventId: id }),

  rsvps: {},
  toggleRsvp: (eventId) =>
    set((state) => ({
      rsvps: { ...state.rsvps, [eventId]: !state.rsvps[eventId] },
    })),

  createdEvents: [],
  addCreatedEvent: (event) => set((state) => ({ createdEvents: [event, ...state.createdEvents] })),

  createdListings: [],
  addCreatedListing: (listing) => set((state) => ({ createdListings: [listing, ...state.createdListings] })),

  hasSeenOnboarding: false,
  completeOnboarding: () => set({ hasSeenOnboarding: true }),
}));
