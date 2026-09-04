import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  ring?: boolean;
}

export function Avatar({ src, alt, size = 36, ring }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-surface-3",
        ring && "ring-2 ring-bg"
      )}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
    </div>
  );
}

export function StackedAvatars({
  avatars,
  extraCount,
  size = 28,
}: {
  avatars: { src: string; alt: string }[];
  extraCount?: number;
  size?: number;
}) {
  return (
    <div className="flex items-center">
      {avatars.map((a, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -size * 0.32 }}>
          <Avatar src={a.src} alt={a.alt} size={size} ring />
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
