// Static, hand-authored content for the illustrated map's fictional world —
// "Mesa Verde": a town that exists only on this map, not tied to real
// geography. It's pure decorative cartography layered under the real
// event/car/track data (which keeps using real lat/lng via makeProjector in
// geo.ts). Coordinates are in the same 0–100 percent space the map canvas
// already renders in.

export const WORLD_NAME = "Mesa Verde";

export interface WorldStreet {
  id: string;
  label: string;
  d: string;
  labelPos: { x: number; y: number; rotate?: number };
  variant: "avenue" | "highway";
}

export const WORLD_STREETS: WorldStreet[] = [
  {
    id: "mesa-verde-ave",
    label: "MESA VERDE AVE",
    d: "M 33 -5 C 30 15, 35 35, 31 55 C 28 72, 32 88, 29 108",
    labelPos: { x: 30, y: 47, rotate: -80 },
    variant: "avenue",
  },
  {
    id: "olive-st",
    label: "OLIVE ST",
    d: "M -5 21 C 22 18, 55 16, 108 11",
    labelPos: { x: 42, y: 17 },
    variant: "avenue",
  },
  {
    id: "foothill-blvd",
    label: "FOOTHILL BLVD",
    d: "M -5 57 C 28 51, 62 53, 108 47",
    labelPos: { x: 15, y: 55 },
    variant: "avenue",
  },
  {
    id: "canyon-rd",
    label: "CANYON RD",
    d: "M 70 -5 C 72 10, 66 20, 70 34",
    labelPos: { x: 73, y: 16, rotate: -78 },
    variant: "avenue",
  },
  {
    id: "state-rte-62",
    label: "STATE RTE 62",
    d: "M -5 80 C 32 71, 68 66, 108 57",
    labelPos: { x: 18, y: 78 },
    variant: "highway",
  },
];

export interface WorldDistrict {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: "downtown" | "park" | "default";
}

export const WORLD_DISTRICTS: WorldDistrict[] = [
  { id: "alder-flats", label: "ALDER FLATS", x: 14, y: 29, kind: "default" },
  { id: "hillside", label: "HILLSIDE", x: 82, y: 33, kind: "default" },
  { id: "centro", label: "CENTRO", x: 46, y: 60, kind: "downtown" },
  { id: "el-rancho", label: "EL RANCHO", x: 19, y: 82, kind: "default" },
  { id: "alder-park", label: "ALDER PARK", x: 11, y: 58, kind: "park" },
];

// A soft "highlands" massif in the far corner — the one non-grid landform,
// with a couple of elevation-contour rings around it for texture.
export const SIERRA_ALTA = {
  label: "SIERRA ALTA",
  cx: 55,
  cy: 6,
  blobD:
    "M 44 3 C 47 -3, 58 -4, 63 1 C 68 3, 70 9, 65 12 C 61 16, 51 15, 46 11 C 42 9, 41 5, 44 3 Z",
};

export const ALDER_PARK_BLOB = "M 6 52 C 10 49, 17 50, 18 55 C 19 60, 14 64, 8 63 C 4 61, 3 55, 6 52 Z";

// --- Procedural city-block texture -----------------------------------------
// A deterministic (seeded) jittered grid of quadrilaterals, standing in for
// parcels/blocks. Regenerating is cheap and stable across renders since it's
// computed once at module load, not per-render.

function seededRandom(seed: number) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

function jitter(seed: number, amount: number) {
  return (seededRandom(seed) - 0.5) * 2 * amount;
}

export interface WorldBlock {
  d: string;
  opacity: number;
}

function generateBlocks(): WorldBlock[] {
  const blocks: WorldBlock[] = [];
  const cols = 10;
  const rows = 12;
  const cellW = 110 / cols;
  const cellH = 110 / rows;
  const originX = -5;
  const originY = -5;
  let seed = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      seed += 1;
      // Leave gaps near the named districts/landmarks so labels stay legible.
      const cx0 = originX + col * cellW + cellW / 2;
      const cy0 = originY + row * cellH + cellH / 2;
      const nearSierra = Math.hypot(cx0 - SIERRA_ALTA.cx, cy0 - SIERRA_ALTA.cy) < 16;
      const skip = seededRandom(seed * 7.3) < 0.07 || nearSierra;
      if (skip) continue;

      const cx = originX + col * cellW;
      const cy = originY + row * cellH;
      const inset = cellW * 0.14;
      const insetY = cellH * 0.14;
      const j = Math.min(cellW, cellH) * 0.22;

      const corners: [number, number][] = [
        [cx + inset + jitter(seed + 1, j), cy + insetY + jitter(seed + 2, j)],
        [cx + cellW - inset + jitter(seed + 3, j), cy + insetY + jitter(seed + 4, j)],
        [cx + cellW - inset + jitter(seed + 5, j), cy + cellH - insetY + jitter(seed + 6, j)],
        [cx + inset + jitter(seed + 7, j), cy + cellH - insetY + jitter(seed + 8, j)],
      ];
      const d = `M ${corners[0][0].toFixed(2)} ${corners[0][1].toFixed(2)} L ${corners[1][0].toFixed(2)} ${corners[1][1].toFixed(2)} L ${corners[2][0].toFixed(2)} ${corners[2][1].toFixed(2)} L ${corners[3][0].toFixed(2)} ${corners[3][1].toFixed(2)} Z`;
      const opacity = 0.3 + seededRandom(seed * 3.1) * 0.4;
      blocks.push({ d, opacity });
    }
  }
  return blocks;
}

export const WORLD_BLOCKS: WorldBlock[] = generateBlocks();
