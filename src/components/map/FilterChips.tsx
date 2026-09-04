"use client";

import { Chip } from "@/components/ui/Chip";
import { EVENT_CATEGORY_LABEL } from "@/lib/data";
import type { EventCategory } from "@/types";

const CATEGORIES: EventCategory[] = ["track-day", "time-attack", "cars-coffee", "meet", "autocross"];

interface FilterChipsProps {
  active: EventCategory[];
  onToggle: (category: EventCategory) => void;
}

export function FilterChips({ active, onToggle }: FilterChipsProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
      {CATEGORIES.map((category) => (
        <Chip
          key={category}
          label={EVENT_CATEGORY_LABEL[category]}
          active={active.includes(category)}
          onClick={() => onToggle(category)}
        />
      ))}
    </div>
  );
}
