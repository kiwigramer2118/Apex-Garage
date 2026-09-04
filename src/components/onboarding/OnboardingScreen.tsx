"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Car, Tag } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const SLIDES = [
  {
    icon: Map,
    title: "Find out what's happening, now",
    body: "A live map of track days, time attacks, and meets across the SoCal scene — for when you've got free time and want to improvise.",
  },
  {
    icon: Car,
    title: "Your garage, the way your car deserves",
    body: "A real profile for your car: specs, mods, and gallery. A place that looks as good as it feels to drive.",
  },
  {
    icon: Tag,
    title: "Sell within your community",
    body: "Lightweight classifieds for parts you're not using anymore — straight to people who know exactly what they are.",
  },
];

export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  function finish() {
    completeOnboarding();
    router.push("/");
  }

  const isLast = index === SLIDES.length - 1;
  const Slide = SLIDES[index];
  const Icon = Slide.icon;

  return (
    <div className="flex h-dvh w-full flex-col bg-bg px-6 pt-[calc(env(safe-area-inset-top)+20px)]">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-button bg-accent-subtle text-accent-ink">
          <span className="font-display text-heading">A</span>
        </div>
        <button type="button" onClick={finish} className="text-caption text-text-muted">
          Skip
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-subtle text-accent-ink">
              <Icon size={34} strokeWidth={1.5} />
            </div>
            <h1 className="max-w-xs font-display text-title text-text-primary">{Slide.title}</h1>
            <p className="max-w-xs text-body text-text-secondary">{Slide.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mb-8 flex flex-col items-center gap-6">
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-pill transition-all duration-200 ease-out-fast ${
                i === index ? "w-6 bg-accent" : "w-1.5 bg-surface-3"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => (isLast ? finish() : setIndex((i) => i + 1))}
          className="w-full max-w-xs rounded-button bg-accent py-3.5 text-body text-onaccent transition-colors duration-150 hover:bg-accent-hover"
        >
          {isLast ? "Get started" : "Next"}
        </button>
      </div>
    </div>
  );
}
