"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, Globe, Instagram, MapPin, Youtube } from "lucide-react";
import type { User } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatMemberSince } from "@/lib/utils";

interface ProfileCoverHeroProps {
  user: User;
  stats: { label: string; value: string | number }[];
  isOwnProfile: boolean;
}

// Cover + avatar + identity block for the unified Profile/Garage screen.
// Deliberately leads with "Member since" instead of age, and role is a
// self-declared identity chip (never a platform-granted badge) per spec.
export function ProfileCoverHero({ user, stats, isOwnProfile }: ProfileCoverHeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.08]);

  const socialEntries = [
    user.socialLinks.instagram && { icon: Instagram, label: `@${user.socialLinks.instagram}` },
    user.socialLinks.youtube && { icon: Youtube, label: user.socialLinks.youtube },
    user.socialLinks.website && { icon: Globe, label: user.socialLinks.website },
  ].filter((v): v is { icon: typeof Instagram; label: string } => !!v);

  return (
    <div>
      <div className="relative h-40 w-full overflow-hidden lg:h-52">
        <motion.div style={{ y, scale }} className="absolute inset-0">
          <Image src={user.coverImage} alt="" fill priority className="object-cover" sizes="100vw" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-bg/10" />

        {!isOwnProfile && (
          <Link
            href="/"
            className="absolute left-4 top-[calc(env(safe-area-inset-top)+16px)] flex h-9 w-9 items-center justify-center rounded-full bg-surface-1/80 text-text-primary backdrop-blur-md"
          >
            <ChevronLeft size={19} strokeWidth={1.75} />
          </Link>
        )}
      </div>

      <div className="mx-auto max-w-2xl px-5">
        <div className="-mt-10 flex items-end justify-between">
          <div className="overflow-hidden rounded-full ring-4 ring-bg">
            <Avatar alt={user.name} size={80} />
          </div>
          {isOwnProfile ? (
            <button
              type="button"
              className="mb-1 rounded-button border border-border bg-surface-1/90 px-4 py-2 text-caption text-text-primary backdrop-blur-sm transition-colors duration-150 hover:bg-surface-2"
            >
              Edit profile
            </button>
          ) : (
            <FollowButton />
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <h1 className="font-display text-title text-text-primary">{user.name}</h1>
          {user.role && <Badge tone="accent">{user.role}</Badge>}
        </div>
        <p className="text-body text-text-muted">@{user.handle}</p>

        <p className="mt-2 max-w-md text-body text-text-secondary">{user.bio}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-text-muted">
          <span className="flex items-center gap-1">
            <MapPin size={13} strokeWidth={1.75} />
            {user.location}
          </span>
          <span>Member since {formatMemberSince(user.memberSince)}</span>
        </div>

        {socialEntries.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {socialEntries.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-caption text-text-secondary">
                <Icon size={14} strokeWidth={1.75} className="text-text-muted" />
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex w-full items-stretch justify-around rounded-card border border-border bg-surface-1 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <span className="font-display text-heading text-text-primary">{s.value}</span>
              <span className="text-caption text-text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Local, session-only follow toggle — no backend to persist to, so this
// mirrors RSVPButton's micro-confirmation language without pretending to
// write real follow-graph state.
function FollowButton() {
  const [following, setFollowing] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFollowing((f) => !f)}
      className={`mb-1 rounded-button px-5 py-2 text-caption transition-colors duration-150 ${
        following ? "bg-surface-3 text-text-primary" : "bg-accent text-onaccent hover:bg-accent-hover"
      }`}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
