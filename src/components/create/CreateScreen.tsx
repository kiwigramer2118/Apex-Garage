"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus, Tag, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateEventForm } from "./CreateEventForm";
import { CreateListingForm } from "./CreateListingForm";

type Step = "choose" | "event" | "listing" | "success";

const stepVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function CreateScreen() {
  const [step, setStep] = useState<Step>("choose");
  const [successLabel, setSuccessLabel] = useState("");
  const router = useRouter();

  function handlePublished(kind: "event" | "listing", redirectHref: string) {
    setSuccessLabel(kind === "event" ? "Tu evento fue publicado" : "Tu clasificado fue publicado");
    setStep("success");
    setTimeout(() => router.push(redirectHref), 1400);
  }

  return (
    <div className="mx-auto max-w-xl px-5 pb-10 pt-6">
      <AnimatePresence mode="wait">
        {step === "choose" && (
          <motion.div key="choose" {...stepVariants} transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}>
            <h1 className="mb-1 font-display text-title text-text-primary">Crear</h1>
            <p className="mb-6 text-body text-text-secondary">¿Qué quieres publicar?</p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setStep("event")}
                className="flex items-center gap-4 rounded-card border border-border bg-surface-1 p-4 text-left transition-colors duration-150 hover:border-accent/50 hover:bg-surface-2"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-button bg-accent-subtle text-accent">
                  <CalendarPlus size={20} strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-body text-text-primary">Evento</span>
                  <span className="block text-caption text-text-muted">
                    Track day, time attack, meet o cars &amp; coffee
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStep("listing")}
                className="flex items-center gap-4 rounded-card border border-border bg-surface-1 p-4 text-left transition-colors duration-150 hover:border-accent/50 hover:bg-surface-2"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-button bg-accent-subtle text-accent">
                  <Tag size={20} strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-body text-text-primary">Clasificado</span>
                  <span className="block text-caption text-text-muted">
                    Vende una pieza a tu propia comunidad
                  </span>
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {step === "event" && (
          <motion.div key="event" {...stepVariants} transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}>
            <CreateEventForm onBack={() => setStep("choose")} onPublished={(href) => handlePublished("event", href)} />
          </motion.div>
        )}

        {step === "listing" && (
          <motion.div key="listing" {...stepVariants} transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}>
            <CreateListingForm
              onBack={() => setStep("choose")}
              onPublished={(href) => handlePublished("listing", href)}
            />
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3 py-20 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
              <Check size={26} strokeWidth={2} />
            </span>
            <p className="text-heading text-text-primary">{successLabel}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
