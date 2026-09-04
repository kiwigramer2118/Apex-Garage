// Lightweight geo helpers for the illustrated (token-free) map. This map is
// explicitly NOT a real cartographic projection of SoCal — it's an abstract
// canvas that preserves the *relative* layout of the mock dataset's points
// (tracks, events, garages) so pins land in sensible, non-overlapping
// positions without depending on Mapbox or any tile provider.

export interface GeoPoint {
  lat: number;
  lng: number;
}

// Approximate real-world coordinates for the SoCal cities used as `location`
// on mock users — just enough to place "garage" pins on the illustrated map
// in a layout that roughly matches reality without claiming precision.
export const CITY_COORDS: Record<string, GeoPoint> = {
  "Long Beach, CA": { lat: 33.7701, lng: -118.1937 },
  "Irvine, CA": { lat: 33.6846, lng: -117.8265 },
  "Torrance, CA": { lat: 33.8358, lng: -118.3406 },
  "San Diego, CA": { lat: 32.7157, lng: -117.1611 },
  "Riverside, CA": { lat: 33.9806, lng: -117.3755 },
  "Anaheim, CA": { lat: 33.8366, lng: -117.9143 },
  "Costa Mesa, CA": { lat: 33.6411, lng: -117.9187 },
  "Huntington Beach, CA": { lat: 33.66, lng: -117.9992 },
};

export interface Projector {
  (point: GeoPoint): { xPct: number; yPct: number };
}

// Builds a min/max normalizer across every point supplied, mapping them into
// a padded 0-100% box. Latitude is flipped (higher lat = further "up" the
// canvas = smaller y%) to read as a map rather than a raw scatter plot.
export function makeProjector(points: GeoPoint[], padPct = 12): Projector {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;
  const span = 100 - padPct * 2;

  return ({ lat, lng }) => {
    const xPct = padPct + ((lng - minLng) / lngRange) * span;
    const yPct = padPct + (1 - (lat - minLat) / latRange) * span;
    return { xPct, yPct };
  };
}
