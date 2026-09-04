"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

export function RSVPButton({ eventId, full }: { eventId: string; full?: boolean }) {
  const attending = useAppStore((s) => !!s.rsvps[eventId]);
  const toggleRsvp = useAppStore((s) => s.toggleRsvp);
  const [justConfirmed, setJustConfirmed] = useState(false);

  function handleClick() {
    const wasAttending = attending;
    toggleRsvp(eventId);
    if (!wasAttending) {
      setJustConfirmed(true);
      setTimeout(() => setJustConfirmed(false), 900);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "relative flex items-center justify-center gap-2 overflow-hidden rounded-button px-5 py-3 text-body transition-colors duration-150 ease-out-fast",
        full && "w-full",
        attending
          ? "bg-surface-3 text-text-primary"
          : "bg-accent text-bg hover:bg-accent-hover"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={attending ? "attending" : "not-attending"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2"
        >
          {attending && <Check size={16} strokeWidth={2} />}
          {attending ? "Vas a asistir" : "Confirmar asistencia"}
        </motion.span>
      </AnimatePresence>

      <AnimatePresence>
        {justConfirmed && (
          <motion.span
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="pointer-events-none absolute h-6 w-6 rounded-full bg-white/30"
          />
        )}
      </AnimatePresence>
    </button>
  );
}
