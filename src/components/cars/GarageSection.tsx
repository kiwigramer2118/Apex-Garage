"use client";

import { useMemo, useState } from "react";
import type { Car } from "@/types";
import { CarCard } from "./CarCard";
import { CarStatusToggle, type GarageFilter } from "./CarStatusToggle";

export function GarageSection({ cars, featuredCarId }: { cars: Car[]; featuredCarId: string | null }) {
  const [filter, setFilter] = useState<GarageFilter>("all");

  const counts = useMemo(() => {
    const c: Record<GarageFilter, number> = { all: cars.length, current: 0, project: 0, sold: 0 };
    cars.forEach((car) => {
      c[car.status] += 1;
    });
    return c;
  }, [cars]);

  const filtered = useMemo(() => {
    const list = filter === "all" ? cars : cars.filter((c) => c.status === filter);
    // Featured car always leads, regardless of the active filter.
    return [...list].sort((a, b) => {
      if (a.id === featuredCarId) return -1;
      if (b.id === featuredCarId) return 1;
      return 0;
    });
  }, [cars, filter, featuredCarId]);

  if (cars.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-card border border-dashed border-border text-body text-text-muted">
        No cars in this garage yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="no-scrollbar overflow-x-auto">
        <CarStatusToggle active={filter} onChange={setFilter} counts={counts} />
      </div>

      {filtered.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-card border border-dashed border-border text-body text-text-muted">
          No cars in this category.
        </div>
      ) : (
        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} featured={car.id === featuredCarId} />
          ))}
        </div>
      )}
    </div>
  );
}
