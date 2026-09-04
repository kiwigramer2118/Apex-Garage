"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BottomTabBar } from "./BottomTabBar";
import { SidebarNav } from "./SidebarNav";

export function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMap = pathname === "/";

  return (
    <div className="min-h-dvh bg-bg">
      <SidebarNav />
      <BottomTabBar />
      <main className={isMap ? "lg:pl-60" : "pb-20 lg:pb-0 lg:pl-60"}>
        {/*
          Deliberately NOT wrapped in AnimatePresence. Gating the new route's
          content behind an exit-animation for the previous page is what was
          causing production navigation to appear stuck on the old screen
          (car-pin "ver garage" links looked like they landed back on "your"
          profile, tab switches looked frozen) until a manual reload forced a
          clean re-render. A plain keyed motion.div still gives every page a
          quick fade/slide-in on mount, but never delays showing it.
        */}
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
