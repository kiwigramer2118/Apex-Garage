"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { navItems } from "./nav-items";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-1/90 backdrop-blur-md safe-bottom lg:hidden"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          const isCreate = item.href === "/create";
          return (
            <li key={item.href} className="relative flex-1">
              <Link
                href={item.href}
                className="relative flex flex-col items-center gap-1 py-2.5 outline-none"
              >
                {active && !isCreate && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute top-0 h-0.5 w-8 rounded-pill bg-accent"
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <span
                  className={cn(
                    "flex items-center justify-center transition-colors duration-150",
                    isCreate
                      ? "-mt-4 h-11 w-11 rounded-full bg-accent text-bg shadow-[0_4px_16px_rgba(255,122,69,0.35)]"
                      : "h-6 w-6"
                  )}
                >
                  <Icon
                    size={isCreate ? 22 : 20}
                    strokeWidth={1.75}
                    className={cn(
                      !isCreate && (active ? "text-accent" : "text-text-muted")
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "text-caption transition-colors duration-150",
                    isCreate
                      ? "text-text-secondary"
                      : active
                        ? "text-text-primary"
                        : "text-text-muted"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
