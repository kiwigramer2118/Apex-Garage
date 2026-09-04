import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/types";

export function CarCard({ car }: { car: Car }) {
  return (
    <Link
      href={`/cars/${car.id}`}
      className="group relative flex h-56 w-64 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-card border border-border bg-surface-2"
    >
      <Image
        src={car.heroImage}
        alt={`${car.year} ${car.make} ${car.model}`}
        fill
        className="object-cover transition-transform duration-200 ease-out-fast group-hover:scale-[1.04]"
        sizes="256px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/5 to-transparent" />
      <div className="relative p-4">
        <p className="text-caption uppercase tracking-wide text-text-muted">
          {car.year} · {car.chassisCode}
        </p>
        <p className="font-display text-heading text-text-primary">
          {car.make} {car.model}
        </p>
      </div>
    </Link>
  );
}
