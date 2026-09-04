import { redirect } from "next/navigation";
import { users, CURRENT_USER_ID } from "@/lib/data";
import { UserProfileScreen } from "@/components/profile/UserProfileScreen";

export function generateStaticParams() {
  return users.map((u) => ({ userId: u.id }));
}

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  // Keep a single canonical URL for "my" profile instead of two pages
  // rendering identical content at /profile and /profile/u8.
  if (params.userId === CURRENT_USER_ID) redirect("/profile");

  return <UserProfileScreen userId={params.userId} />;
}
