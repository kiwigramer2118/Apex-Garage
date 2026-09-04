import { CURRENT_USER_ID } from "@/lib/data";
import { UserProfileScreen } from "@/components/profile/UserProfileScreen";

// Garage is a section of a Profile, not a separate entity — the bottom-tab
// shortcut lands on the same unified screen as /profile.
export default function GaragePage() {
  return <UserProfileScreen userId={CURRENT_USER_ID} />;
}
