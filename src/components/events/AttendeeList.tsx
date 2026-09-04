"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserById } from "@/lib/data";
import { Avatar, StackedAvatars } from "@/components/ui/Avatar";

export function AttendeeList({ attendeeIds, capacity }: { attendeeIds: string[]; capacity: number }) {
  const [expanded, setExpanded] = useState(false);
  const users = attendeeIds.map((id) => getUserById(id)).filter((u): u is NonNullable<typeof u> => !!u);
  const preview = users.slice(0, 5).map((u) => ({ src: u.avatar, alt: u.name }));

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between"
      >
        <StackedAvatars avatars={preview} extraCount={Math.max(users.length - preview.length, 0)} size={32} />
        <span className="text-caption text-text-muted">
          {users.length}/{capacity} confirmed
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 flex flex-col gap-2.5 overflow-hidden"
          >
            {users.map((u) => (
              <li key={u.id} className="flex items-center gap-3">
                <Avatar src={u.avatar} alt={u.name} size={30} />
                <span className="text-body text-text-secondary">{u.name}</span>
                <span className="text-caption text-text-muted">@{u.handle}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
