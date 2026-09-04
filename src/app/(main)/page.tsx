import { Suspense } from "react";
import { MapScreen } from "@/components/map/MapScreen";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="h-dvh w-full animate-pulse bg-surface-1" />}>
      <MapScreen />
    </Suspense>
  );
}
