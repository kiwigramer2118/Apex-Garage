import { events } from "@/lib/data";
import { EventDetailScreen } from "@/components/events/EventDetailScreen";

export function generateStaticParams() {
  return events.map((e) => ({ eventId: e.id }));
}

export default function EventDetailPage({ params }: { params: { eventId: string } }) {
  return <EventDetailScreen eventId={params.eventId} />;
}
