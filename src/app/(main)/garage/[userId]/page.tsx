import { redirect } from "next/navigation";
import { users, CURRENT_USER_ID } from "@/lib/data";
import { GarageScreen } from "@/components/cars/GarageScreen";

export function generateStaticParams() {
  return users.map((u) => ({ userId: u.id }));
}

export default function UserGaragePage({ params }: { params: { userId: string } }) {
  // Keep a single canonical URL for "my" garage instead of two pages
  // rendering identical content at /garage and /garage/u8.
  if (params.userId === CURRENT_USER_ID) redirect("/garage");

  return <GarageScreen userId={params.userId} />;
}
