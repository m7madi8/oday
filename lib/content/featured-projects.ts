import { projects, type Project } from "@/lib/data";

/** Homepage selected-work bento — B.H Villa 12 leads, then supporting exteriors. */
export const featuredProjectIds = [
  "vil-villa-12-bh",
  "vil-hassan-salameh-27",
  "vil-villa-10-viv",
  "vil-nasim-shawahneh-42",
  "vil-dr-baha-14",
  "vil-baha-hamdallah-8",
  "vil-tareq-fifil-58",
] as const;

export const featuredProjectsSection = {
  eyebrow: "Selected Work",
  title: "Featured Projects",
  titleAccent: "Curated case studies",
  description:
    "A preview of exterior and interior delivery — villas, residences, and branded environments from the OD Architects archive.",
  ctaLabel: "View full gallery",
  ctaHref: "/projects",
} as const;

export function getFeaturedProjects(): Project[] {
  return featuredProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is Project => project != null);
}
