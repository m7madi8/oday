export const serviceSlugs = [
  "exterior",
  "interior",
  "architecture-ai",
  "architecture-drone",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];
