import { cn } from "@/lib/utils";

// User avatars are deterministic initials-on-gradient chips rather than
// hotlinked stock "person" photos — there's no real photo library for a
// mock roster of fictional members, and stand-in stock faces read as fake
// in a premium product. The gradient is derived from the name so a given
// person always gets the same colorway across the app.
function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// A small fixed palette of hue pairs tuned to sit comfortably against the
// app's white/off-white surfaces — vivid but each pair keeps enough internal
// contrast for the centered initials to stay legible.
const GRADIENT_PAIRS: [string, string][] = [
  ["#B3F22C", "#6FA30F"], // accent lime -> deep olive
  ["#0F9D6B", "#0B6E4C"], // success teal-greens
  ["#3D7DFF", "#2450B8"], // vivid blue
  ["#8B5CF6", "#5B32C4"], // violet
  ["#F5B942", "#E2843A"], // amber
  ["#4AC4D9", "#2E93A8"], // teal
  ["#E24B8F", "#B93A6E"], // magenta
];

interface AvatarProps {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  ring?: boolean;
}

export function Avatar({ alt, size = 36, ring, className }: AvatarProps) {
  const hash = hashString(alt || "?");
  const [from, to] = GRADIENT_PAIRS[hash % GRADIENT_PAIRS.length];
  const angle = hash % 360;

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full text-text-primary",
        ring && "ring-2 ring-bg",
        className
      )}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(${angle}deg, ${from}, ${to})`,
      }}
    >
      <span
        className="font-display leading-none"
        style={{ fontSize: Math.max(10, size * 0.36) }}
      >
        {initialsFor(alt)}
      </span>
    </div>
  );
}

export function StackedAvatars({
  avatars,
  extraCount,
  size = 28,
}: {
  avatars: { src?: string; alt: string }[];
  extraCount?: number;
  size?: number;
}) {
  return (
    <div className="flex items-center">
      {avatars.map((a, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -size * 0.32 }}>
          <Avatar alt={a.alt} size={size} ring />
        </div>
      ))}
      {extraCount && extraCount > 0 && (
        <div
          className="flex items-center justify-center rounded-full bg-surface-3 text-caption text-text-secondary ring-2 ring-bg"
          style={{ width: size, height: size, marginLeft: -size * 0.32 }}
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
}
