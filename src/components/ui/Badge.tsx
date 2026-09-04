import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  tone?: "default" | "accent" | "success" | "muted";
  className?: string;
}

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-surface-3 text-text-secondary",
  accent: "bg-accent-subtle text-accent-ink",
  success: "bg-success/15 text-success",
  muted: "bg-surface-2 text-text-muted",
};

export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-caption",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
