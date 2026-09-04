import { listings } from "@/lib/data";
import { ListingDetailScreen } from "@/components/classifieds/ListingDetailScreen";

export function generateStaticParams() {
  return listings.map((l) => ({ listingId: l.id }));
}

export default function ListingDetailPage({ params }: { params: { listingId: string } }) {
  return <ListingDetailScreen listingId={params.listingId} />;
}
