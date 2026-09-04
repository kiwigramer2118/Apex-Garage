"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

// Light, dismissible — never blocks the map. Shown once per session for
// first-time visitors, matching the "onboarding no bloqueante" requirement.
export function OnboardingBanner() {
  const hasSeenOnboarding = useAppStore((s) => s.hasSeenOnboarding);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  return (
    <AnimatePresence>
      {!hasSeenOnboarding && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto mx-4 mt-1 flex items-center gap-2 rounded-pill border border-accent/30 bg-accent-subtle px-3.5 py-2"
        >
          <Sparkles size={14} className="shrink-0 text-accent-ink" />
          <Link href="/onboarding" className="flex-1 text-caption text-text-primary">
            Nuevo en Apex Garage — ve el recorrido rápido
          </Link>
          <button
            type="button"
            onClick={completeOnboarding}
            aria-label="Cerrar"
            className="text-text-muted"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
