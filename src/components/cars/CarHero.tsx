"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import type { Car } from "@/types";
import { CAR_STATUS_LABEL } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";

const STATUS_TONE: Record<Car["status"], "success" | "accent" | "muted"> = {
  current: "success",
  project: "accent",
  sold: "muted",
};

export function CarHero({ car }: { car: Car }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 90]);
  const scale = useTransform(scrollY, [0, 400], [1, 1.12]);

  return (
    <div ref={containerRef} className="relative h-[52vh] w-full overflow-hidden lg:h-[64vh]">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={car.heroImage}
          alt={`${car.year} ${car.make} ${car.model}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-bg/40" />

      <Link
        href={`/profile/${car.ownerId}`}
        className="absolute left-4 top-[calc(env(safe-area-inset-top)+16px)] flex h-9 w-9 items-center justify-center rounded-full bg-surface-1/80 text-text-primary backdrop-blur-md"
      >
        <ChevronLeft size={19} strokeWidth={1.75} />
      </Link>

      <div className="absolute inset-x-0 bottom-0 px-5 pb-6">
        <div className="mb-1.5 flex items-center gap-2">
          <p className="text-caption uppercase tracking-wide text-text-muted">
            {car.year} · {car.chassisCode}
          </p>
          <Badge tone={STATUS_TONE[car.status]}>{CAR_STATUS_LABEL[car.status]}</Badge>
        </div>
        <h1 className="font-display text-display text-text-primary">
          {car.make} {car.model}
        </h1>
        <p className="text-body text-text-secondary">&ldquo;{car.nickname}&rdquo;</p>
      </div>
    </div>
  );
}
