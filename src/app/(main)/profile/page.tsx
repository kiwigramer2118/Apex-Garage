import { CURRENT_USER_ID } from "@/lib/data";
import { UserProfileScreen } from "@/components/profile/UserProfileScreen";

export default function ProfilePage() {
  return <UserProfileScreen userId={CURRENT_USER_ID} />;
}
