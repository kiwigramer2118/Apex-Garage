import { notFound } from "next/navigation";
import Link from "next/link";
import { Gauge, Timer } from "lucide-react";
import { cars, getCarById, getUserById, getTrackById } from "@/lib/data";
import { CarHero } from "@/components/cars/CarHero";
import { SpecsAccordion } from "@/components/cars/SpecsAccordion";
import { GalleryLightbox } from "@/components/cars/GalleryLightbox";
import { Avatar } from "@/components/ui/Avatar";

export function generateStaticParams() {
  return cars.map((c) => ({ carId: c.id }));
}

export default function CarProfilePage({ params }: { params: { carId: string } }) {
  const car = getCarById(params.carId);
  if (!car) notFound();

  const owner = getUserById(car.ownerId);
  const track = car.bestLapTrackId ? getTrackById(car.bestLapTrackId) : null;

  return (
    <div className="pb-10">
      <CarHero car={car} />

      <div className="mx-auto max-w-2xl px-5 pt-5">
        <div className="mb-6 flex items-center justify-between gap-4 rounded-card border border-border bg-surface-1 p-4">
          {owner && (
            <Link href={`/profile/${owner.id}`} className="flex items-center gap-3">
              <Avatar alt={owner.name} size={40} />
              <div>
                <p className="text-body text-text-primary">{owner.name}</p>
                <p className="text-caption text-text-muted">@{owner.handle}</p>
              </div>
            </Link>
          )}
          {car.bestLapTime ? (
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 text-caption text-text-muted">
                <Timer size={13} />
                Mejor vuelta
              </div>
              <p className="font-display text-heading text-accent">{car.bestLapTime}</p>
              {track && <p className="text-caption text-text-muted">{track.shortName}</p>}
            </div>
          ) : (
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 text-caption text-text-muted">
                <Gauge size={13} />
                Sin tiempo aún
              </div>
            </div>
          )}
        </div>

        <SpecsAccordion specs={car.specs} mods={car.mods} />

        <div className="mt-6">
          <h2 className="mb-3 text-heading text-text-primary">Galería</h2>
          <GalleryLightbox images={car.gallery} alt={`${car.make} ${car.model}`} />
        </div>
      </div>
    </div>
  );
}
