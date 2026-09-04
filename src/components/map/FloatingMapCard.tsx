"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const CARD_WIDTH = 296;
const CARD_MARGIN = 14;

interface FloatingMapCardProps {
  anchor: { x: number; y: number };
  containerSize: { width: number; height: number };
  onClose: () => void;
  children: React.ReactNode;
}

// A "cool" floating detail card anchored to a map pin's screen position,
// clamped inside the map viewport so it never runs off-canvas — used for
// both event and car pins on the illustrated map. Purely presentational:
// callers supply the anchor's pixel position (post pan/zoom transform) and
// the card figures out where to sit relative to it.
export function FloatingMapCard({ anchor, containerSize, onClose, children }: FloatingMapCardProps) {
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) setHeight(ref.current.offsetHeight);
  }, [children]);

  const openAbove = anchor.y > containerSize.height / 2;
  const left = Math.min(
    Math.max(anchor.x - CARD_WIDTH / 2, CARD_MARGIN),
    Math.max(containerSize.width - CARD_WIDTH - CARD_MARGIN, CARD_MARGIN)
  );
  const rawTop = openAbove ? anchor.y - height - 24 : anchor.y + 24;
  const top = Math.min(
    Math.max(rawTop, CARD_MARGIN),
    Math.max(containerSize.height - height - CARD_MARGIN, CARD_MARGIN)
  );

  return (
    <motion.div
      ref={ref}
      className="absolute z-30 overflow-hidden rounded-card border border-border bg-surface-1 shadow-[0_16px_48px_rgba(0,0,0,0.2)]"
      style={{ width: CARD_WIDTH, left, top }}
      initial={{ opacity: 0, scale: 0.9, y: openAbove ? 8 : -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-bg/70 text-text-secondary backdrop-blur-sm transition-colors duration-150 hover:text-text-primary"
      >
        <X size={14} strokeWidth={1.75} />
      </button>
      {children}
    </motion.div>
  );
}
