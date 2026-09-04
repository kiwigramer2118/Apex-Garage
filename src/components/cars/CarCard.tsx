import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Car } from "@/types";
import { CAR_STATUS_LABEL } from "@/lib/data";

const STATUS_TONE: Record<Car["status"], string> = {
  current: "bg-success/15 text-success",
  project: "bg-accent-subtle text-accent-ink",
  sold: "bg-surface-3 text-text-secondary",
};

export function CarCard({ car, featured }: { car: Car; featured?: boolean }) {
  return (
    <Link
      href={`/cars/${car.id}`}
      className="group relative flex h-56 w-64 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-card border border-border bg-surface-2 transition-all duration-200 ease-out-fast hover:-translate-y-0.5 hover:border-text-muted/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
    >
      <Image
        src={car.heroImage}
        alt={`${car.year} ${car.make} ${car.model}`}
        fill
        className="object-cover transition-transform duration-200 ease-out-fast group-hover:scale-[1.04]"
        sizes="256px"
      />
      {/* Fixed dark scrim so the make/model text below stays legible over the
          photo in both light and dark themes — see CarHero for the same
          pattern. */}
      <div className="absolute inset-0 bg-gradient-to-t from-scrim/90 via-scrim/25 to-transparent" />

      <div className="absolute left-3 top-3 flex items-center gap-1.5">
        <span className={`rounded-pill px-2.5 py-1 text-caption ${STATUS_TONE[car.status]}`}>
          {CAR_STATUS_LABEL[car.status]}
        </span>
        {featured && (
          <span className="flex items-center gap-1 rounded-pill bg-surface-1/85 px-2.5 py-1 text-caption text-text-secondary backdrop-blur-sm">
            <Star size={11} className="fill-accent text-accent-ink" />
            Featured
          </span>
        )}
      </div>

      <div className="relative p-4">
        <p className="text-caption uppercase tracking-wide text-white/60">
          {car.year} · {car.chassisCode}
        </p>
        <p className="font-display text-heading text-white">
          {car.make} {car.model}
        </p>
      </div>
    </Link>
  );
}
