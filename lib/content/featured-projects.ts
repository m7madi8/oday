import { projects, type Project } from "@/lib/data";

/** Homepage selected-work bento — B.H Villa 12 leads, then villas + interior highlights. */
export const featuredProjectIds = [
  "vil-villa-12-bh",
  "vil-hassan-salameh-27",
  "vil-dr-baha-14",
  "vil-nasim-shawahneh-42",
  "in-diaaab-11",
  "in-howida-living-room-render-s-29",
  "in-saleh-bedroom-52",
] as const;

export const featuredProjectsSection = {
  eyebrow: "Selected Work",
  title: "Featured Projects",
  titleAccent: "Curated case studies",
  ctaLabel: "View full gallery",
  ctaHref: "/projects",
} as const;

export function getFeaturedProjects(): Project[] {
  return featuredProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is Project => project != null);
}
