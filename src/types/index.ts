export type TrackId = "buttonwillow" | "willow-springs" | "chuckwalla";

export interface Track {
  id: TrackId;
  name: string;
  shortName: string;
  city: string;
  lat: number;
  lng: number;
  configLayout: string;
}

export type EventCategory = "track-day" | "time-attack" | "cars-coffee" | "meet" | "autocross";

export interface EventAttendee {
  userId: string;
}

export interface TrackEvent {
  id: string;
  title: string;
  category: EventCategory;
  trackId: TrackId;
  date: string; // ISO date
  startTime: string; // "07:00"
  endTime: string; // "16:00"
  lat: number;
  lng: number;
  description: string;
  hostId: string;
  capacity: number;
  attendeeIds: string[];
  priceUsd: number | null;
  isLive: boolean;
  coverImage: string;
}

export type DrivetrainLayout = "FR" | "AWD" | "MR" | "FF";

export interface CarSpecs {
  power: string;
  weight: string;
  drivetrain: DrivetrainLayout;
  transmission: string;
  tires: string;
  suspension: string;
}

export interface CarModCategory {
  category: string;
  items: string[];
}

export interface Car {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  chassisCode: string;
  year: number;
  nickname: string;
  heroImage: string;
  gallery: string[];
  specs: CarSpecs;
  mods: CarModCategory[];
  bestLapTrackId: TrackId | null;
  bestLapTime: string | null;
}

export interface User {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  location: string;
  bio: string;
  memberSince: string;
  carIds: string[];
  followerCount: number;
  followingCount: number;
}

export type ListingCategory = "wheels" | "suspension" | "exterior" | "engine" | "interior" | "electronics" | "exhaust" | "brakes";
export type ListingCondition = "new" | "like-new" | "used" | "for-parts";

export interface Listing {
  id: string;
  title: string;
  category: ListingCategory;
  condition: ListingCondition;
  priceUsd: number;
  negotiable: boolean;
  location: string;
  description: string;
  images: string[];
  sellerId: string;
  fitment: string;
  postedAt: string; // ISO date
  carId: string | null;
}

export interface ActivityItem {
  id: string;
  userId: string;
  type: "rsvp" | "listing" | "car-update" | "lap-time";
  targetId: string;
  createdAt: string;
}
