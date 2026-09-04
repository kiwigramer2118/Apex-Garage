import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types";
import { LISTING_CATEGORY_LABEL } from "@/lib/data";
import { formatPrice, timeAgo } from "@/lib/utils";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/classifieds/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-card border border-border bg-surface-1 transition-all duration-200 ease-out-fast hover:-translate-y-0.5 hover:border-text-muted/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-2">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-200 ease-out-fast group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 25vw, 50vw"
        />
        <span className="absolute left-2 top-2 rounded-pill bg-surface-1/85 px-2 py-1 text-caption text-text-secondary backdrop-blur-sm">
          {LISTING_CATEGORY_LABEL[listing.category]}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-body text-text-primary">{listing.title}</p>
        <p className="font-display text-heading text-accent">{formatPrice(listing.priceUsd)}</p>
        <div className="mt-1 flex items-center justify-between text-caption text-text-muted">
          <span>{listing.location}</span>
          <span>{timeAgo(listing.postedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
