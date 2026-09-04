"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
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
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
