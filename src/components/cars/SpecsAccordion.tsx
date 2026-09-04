"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { CarModCategory, CarSpecs } from "@/types";

const SPEC_LABELS: { key: keyof CarSpecs; label: string }[] = [
  { key: "power", label: "Power" },
  { key: "weight", label: "Weight" },
  { key: "drivetrain", label: "Drivetrain" },
  { key: "transmission", label: "Transmission" },
  { key: "tires", label: "Tires" },
  { key: "suspension", label: "Suspension" },
];

function AccordionSection({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-heading text-text-primary">{title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-text-muted"
        >
          <ChevronDown size={18} strokeWidth={1.75} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SpecsAccordion({ specs, mods }: { specs: CarSpecs; mods: CarModCategory[] }) {
  return (
    <div>
      <AccordionSection title="Specs" defaultOpen>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          {SPEC_LABELS.map(({ key, label }) => (
            <div key={key}>
              <dt className="text-caption text-text-muted">{label}</dt>
              <dd className="text-body text-text-primary">{specs[key]}</dd>
            </div>
          ))}
        </dl>
      </AccordionSection>

      {mods.map((group) => (
        <AccordionSection key={group.category} title={group.category}>
          <ul className="flex flex-col gap-2">
            {group.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-body text-text-secondary">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </AccordionSection>
      ))}
    </div>
  );
}
