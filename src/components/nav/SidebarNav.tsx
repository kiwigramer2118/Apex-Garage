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

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-surface-1 px-4 py-6 lg:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-button bg-accent-subtle text-accent">
          <span className="font-display text-heading">A</span>
        </div>
        <span className="font-display text-heading text-text-primary">Apex Garage</span>
      </div>

      <ul className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-button px-3 py-2.5 text-body transition-colors duration-150",
                  active ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-indicator"
                    className="absolute inset-0 rounded-button bg-surface-2"
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <Icon
                  size={19}
                  strokeWidth={1.75}
                  className={cn("relative", active ? "text-accent" : "text-text-muted")}
                />
                <span className="relative">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="px-3 text-caption text-text-muted">SoCal track scene · PoC</p>
    </aside>
  );
}
