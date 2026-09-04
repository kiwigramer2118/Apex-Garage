import { CURRENT_USER_ID } from "@/lib/data";
import { GarageScreen } from "@/components/cars/GarageScreen";

// Garage is its own tab — car collection only. Profile (identity + account)
// lives at /profile; the two never render duplicate content.
export default function GaragePage() {
  return <GarageScreen userId={CURRENT_USER_ID} />;
}
