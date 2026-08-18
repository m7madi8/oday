export const serviceSlugs = [
  "exterior",
  "interior",
  "architecture-ai",
  "architecture-drone",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

/** Sub-categories within the Exterior gallery (includes former Landscape work). */
export const exteriorProjectTypes = [
  "villas",
  "residential-buildings",
  "cottage",
  "landscape",
] as const;

export type ExteriorProjectType = (typeof exteriorProjectTypes)[number];

export const exteriorTypeLabels: Record<ExteriorProjectType, string> = {
  villas: "Villas",
  "residential-buildings": "Residential Buildings",
  cottage: "Cottage",
  landscape: "Landscape",
};

export function exteriorTypeLabel(type: ExteriorProjectType): string {
  return exteriorTypeLabels[type];
}
