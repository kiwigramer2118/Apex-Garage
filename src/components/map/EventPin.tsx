// Builds a detached DOM element used as a Mapbox GL custom marker.
// Kept as plain DOM (not React) because mapbox-gl markers live outside the
// React tree. Entrance animation and the "live" pulse both reuse the
// animate-scale-in / animate-pulse-live utilities generated from the
// keyframes in tailwind.config.ts, so everything stays on the same easing
// and timing system as the rest of the app.
import type { EventCategory } from "@/types";

const CATEGORY_COLOR: Record<EventCategory, string> = {
  "track-day": "#FF7A45",
  "time-attack": "#E24B4A",
  "cars-coffee": "#4A9B6E",
  meet: "#9A9A9C",
  autocross: "#F5F5F4",
};

export function createEventPinElement(opts: {
  category: EventCategory;
  isLive: boolean;
  delayMs: number;
}): HTMLDivElement {
  const color = CATEGORY_COLOR[opts.category];

  const wrapper = document.createElement("div");
  wrapper.className =
    "apex-pin relative flex h-8 w-8 cursor-pointer items-center justify-center animate-scale-in transition-opacity duration-200 ease-out-fast";
  wrapper.style.animationDelay = `${opts.delayMs}ms`;
  wrapper.style.animationFillMode = "backwards";

  if (opts.isLive) {
    const pulse = document.createElement("span");
    pulse.className = "absolute h-3 w-3 rounded-full animate-pulse-live";
    pulse.style.background = color;
    wrapper.appendChild(pulse);
  }

  const dot = document.createElement("span");
  dot.className = "relative h-3 w-3 rounded-full border-2 border-bg shadow-[0_1px_4px_rgba(0,0,0,0.5)]";
  dot.style.background = color;
  wrapper.appendChild(dot);

  return wrapper;
}
