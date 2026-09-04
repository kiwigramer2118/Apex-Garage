import tracksJson from "@/data/tracks.json";
import usersJson from "@/data/users.json";
import carsJson from "@/data/cars.json";
import eventsJson from "@/data/events.json";
import listingsJson from "@/data/listings.json";
import activityJson from "@/data/activity.json";
import type { Track, User, Car, TrackEvent, Listing, ActivityItem } from "@/types";

export const tracks = tracksJson as Track[];
export const users = usersJson as User[];
export const cars = carsJson as Car[];
export const events = eventsJson as TrackEvent[];
export const listings = listingsJson as Listing[];
export const activity = activityJson as ActivityItem[];

// The signed-in persona for this PoC — no real auth, so we hardcode "you".
export const CURRENT_USER_ID = "u8";

export function getCurrentUser(): User {
  return users.find((u) => u.id === CURRENT_USER_ID)!;
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getCarById(id: string): Car | undefined {
  return cars.find((c) => c.id === id);
}

export function getCarsByOwner(ownerId: string): Car[] {
  return cars.filter((c) => c.ownerId === ownerId);
}

export function getTrackById(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getEventById(id: string): TrackEvent | undefined {
  return events.find((e) => e.id === id);
}

export function getListingById(id: string): Listing | undefined {
  return listings.find((l) => l.id === id);
}

export function getListingsBySeller(sellerId: string): Listing[] {
  return listings.filter((l) => l.sellerId === sellerId);
}

export function getActivityForUser(userId: string): ActivityItem[] {
  return activity
    .filter((a) => a.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const EVENT_CATEGORY_LABEL: Record<string, string> = {
  "track-day": "Track Day",
  "time-attack": "Time Attack",
  "cars-coffee": "Cars & Coffee",
  meet: "Meet",
  autocross: "Autocross",
};

export const LISTING_CATEGORY_LABEL: Record<string, string> = {
  wheels: "Wheels",
  suspension: "Suspension",
  exterior: "Exterior",
  engine: "Engine",
  interior: "Interior",
  electronics: "Electronics",
  exhaust: "Exhaust",
  brakes: "Brakes",
};

export const LISTING_CONDITION_LABEL: Record<string, string> = {
  new: "New",
  "like-new": "Like New",
  used: "Used",
  "for-parts": "For Parts",
};
