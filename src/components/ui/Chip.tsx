"use client";

import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, active, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-pill border px-4 py-2 text-caption transition-all duration-150 ease-out-fast",
        active
          ? "border-accent bg-accent-subtle text-accent"
          : "border-border bg-surface-2/80 text-text-secondary hover:text-text-primary",
        className
      )}
    >
      {label}
    </button>
  );
}
