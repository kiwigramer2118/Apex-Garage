"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function GalleryLightbox({ images, alt }: { images: string[]; alt: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function next() {
    setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
  }
  function prev() {
    setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface-2"
          >
            <Image
              src={src}
              alt={`${alt} — foto ${i + 1}`}
              fill
              className="object-cover transition-transform duration-200 ease-out-fast hover:scale-[1.03]"
              sizes="(min-width: 1024px) 320px, 50vw"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpenIndex(null)}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              aria-label="Cerrar"
              className="absolute right-4 top-[calc(env(safe-area-inset-top)+16px)] flex h-9 w-9 items-center justify-center rounded-full bg-surface-1/80 text-text-primary"
            >
              <X size={18} strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Anterior"
              className="absolute left-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface-1/80 text-text-primary"
            >
              <ChevronLeft size={19} strokeWidth={1.75} />
            </button>

            <motion.div
              key={openIndex}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) next();
                else if (info.offset.x > 80) prev();
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative mx-6 aspect-[4/3] w-full max-w-xl cursor-grab active:cursor-grabbing"
            >
              <Image
                src={images[openIndex]}
                alt={`${alt} — foto ${openIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Siguiente"
              className="absolute right-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface-1/80 text-text-primary"
            >
              <ChevronRight size={19} strokeWidth={1.75} />
            </button>

            <div className="absolute bottom-6 flex gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-pill transition-all duration-200 ease-out-fast ${
                    i === openIndex ? "w-4 bg-accent" : "w-1.5 bg-text-muted/50"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
