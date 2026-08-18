import { exteriorTypeLabel, type ExteriorProjectType } from "@/lib/data";

/** Short hash ids kept for inbound links; labels resolve from the single label source. */
const ANCHOR_IDS = [
  { id: "villas", type: "villas" as const, order: "01" },
  { id: "resid", type: "residential-buildings" as const, order: "02" },
  { id: "cottage", type: "cottage" as const, order: "03" },
  { id: "land", type: "landscape" as const, order: "04" },
] as const;

export const GALLERY_CATEGORY_ANCHORS = ANCHOR_IDS.map((anchor) => ({
  ...anchor,
  label: exteriorTypeLabel(anchor.type),
}));

export type GalleryCategoryAnchorId = (typeof ANCHOR_IDS)[number]["id"];

export function galleryHashToExteriorType(hash: string): ExteriorProjectType | null {
  const normalized = hash.replace(/^#/, "").trim();
  return ANCHOR_IDS.find((item) => item.id === normalized)?.type ?? null;
}

export function exteriorTypeToGalleryHash(type: ExteriorProjectType): GalleryCategoryAnchorId {
  return ANCHOR_IDS.find((item) => item.type === type)?.id ?? "villas";
}
