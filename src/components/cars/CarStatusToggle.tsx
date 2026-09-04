"use client";

import { motion } from "framer-motion";
import type { CarStatus } from "@/types";
import { CAR_STATUS_LABEL } from "@/lib/data";
import { cn } from "@/lib/utils";

export type GarageFilter = "all" | CarStatus;

const OPTIONS: GarageFilter[] = ["all", "current", "project", "sold"];
const LABEL: Record<GarageFilter, string> = { all: "Todos", ...CAR_STATUS_LABEL } as Record<GarageFilter, string>;

// Sliding-indicator segmented control — same layoutId pattern as the bottom
// tab bar's active indicator, so it reads as part of the same motion
// language rather than a one-off control.
export function CarStatusToggle({
  active,
  onChange,
  counts,
}: {
  active: GarageFilter;
  onChange: (value: GarageFilter) => void;
  counts: Record<GarageFilter, number>;
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-pill border border-border bg-surface-2 p-1">
      {OPTIONS.map((opt) => {
        const isActive = active === opt;
        const count = counts[opt] ?? 0;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            disabled={opt !== "all" && count === 0}
            className={cn(
              "relative rounded-pill px-3.5 py-1.5 text-caption transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="garage-status-indicator"
                className="absolute inset-0 rounded-pill bg-surface-3"
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <span className={cn("relative z-10", isActive ? "text-text-primary" : "text-text-muted")}>
              {LABEL[opt]}
              {count > 0 && <span className="ml-1 text-text-muted">{count}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
