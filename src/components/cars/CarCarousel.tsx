import type { Car } from "@/types";
import { CarCard } from "./CarCard";

export function CarCarousel({ cars }: { cars: Car[] }) {
  if (cars.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-card border border-dashed border-border text-body text-text-muted">
        No cars in this garage yet.
      </div>
    );
  }

  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
