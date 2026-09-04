import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Tag } from "lucide-react";
import {
  listings,
  getListingById,
  getUserById,
  getCarById,
  LISTING_CATEGORY_LABEL,
  LISTING_CONDITION_LABEL,
} from "@/lib/data";
import { ImageCarousel } from "@/components/classifieds/ImageCarousel";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { formatPrice, timeAgo } from "@/lib/utils";

export function generateStaticParams() {
  return listings.map((l) => ({ listingId: l.id }));
}

export default function ListingDetailPage({ params }: { params: { listingId: string } }) {
  const listing = getListingById(params.listingId);
  if (!listing) notFound();

  const seller = getUserById(listing.sellerId);
  const car = listing.carId ? getCarById(listing.carId) : null;

  return (
    <div className="mx-auto max-w-2xl px-5 pb-10 pt-5">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/classifieds"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-primary"
        >
          <ChevronLeft size={19} strokeWidth={1.75} />
        </Link>
        <Badge tone="default">
          <Tag size={11} /> {LISTING_CATEGORY_LABEL[listing.category]}
        </Badge>
      </div>

      <ImageCarousel images={listing.images} alt={listing.title} />

      <div className="mt-5">
        <div className="mb-1 flex items-center gap-2">
          <Badge tone="accent">{LISTING_CONDITION_LABEL[listing.condition]}</Badge>
          {listing.negotiable && <Badge tone="muted">Negociable</Badge>}
        </div>
        <h1 className="font-display text-title text-text-primary">{listing.title}</h1>
        <p className="mt-1 font-display text-display text-accent">{formatPrice(listing.priceUsd)}</p>
      </div>

      <div className="mt-4 flex items-center gap-2 text-caption text-text-muted">
        <MapPin size={14} />
        <span>{listing.location}</span>
        <span>·</span>
        <span>Publicado {timeAgo(listing.postedAt)}</span>
      </div>

      <div className="mt-6">
        <h2 className="mb-2 text-heading text-text-primary">Descripción</h2>
        <p className="text-body leading-relaxed text-text-secondary">{listing.description}</p>
      </div>

      <div className="mt-5 rounded-card border border-border bg-surface-1 p-4">
        <p className="text-caption text-text-muted">Fitment</p>
        <p className="text-body text-text-primary">{listing.fitment}</p>
      </div>

      {seller && (
        <div className="mt-6">
          <h2 className="mb-2 text-heading text-text-primary">Vendedor</h2>
          <div className="flex items-center gap-3 rounded-card border border-border bg-surface-1 p-3">
            <Avatar src={seller.avatar} alt={seller.name} size={40} />
            <div className="flex-1">
              <p className="text-body text-text-primary">{seller.name}</p>
              <p className="text-caption text-text-muted">@{seller.handle}</p>
            </div>
            {car && (
              <Link href={`/cars/${car.id}`} className="text-caption text-accent underline underline-offset-2">
                Ver su {car.model}
              </Link>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        className="mt-8 w-full rounded-button bg-accent py-3.5 text-body text-bg transition-colors duration-150 hover:bg-accent-hover"
      >
        Contactar vendedor
      </button>
    </div>
  );
}
