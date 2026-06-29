import type { ExteriorProjectType } from "@/lib/data";

export const GALLERY_CATEGORY_ANCHORS = [
  { id: "villas", type: "villas" as const, label: "Villas", order: "01" },
  { id: "resid", type: "residential-buildings" as const, label: "Resid.", order: "02" },
  { id: "cottage", type: "cottage" as const, label: "Cottage", order: "03" },
  { id: "land", type: "landscape" as const, label: "Land.", order: "04" },
] as const;

export type GalleryCategoryAnchorId = (typeof GALLERY_CATEGORY_ANCHORS)[number]["id"];

export function galleryHashToExteriorType(hash: string): ExteriorProjectType | null {
  const normalized = hash.replace(/^#/, "").trim();
  const match = GALLERY_CATEGORY_ANCHORS.find((item) => item.id === normalized);
  return match?.type ?? null;
}

export function exteriorTypeToGalleryHash(type: ExteriorProjectType): GalleryCategoryAnchorId {
  const match = GALLERY_CATEGORY_ANCHORS.find((item) => item.type === type);
  return match?.id ?? "villas";
}
