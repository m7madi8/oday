import { projects, type Project } from "@/lib/data";

/** Homepage anchor — B.H Villa 12 leads the Selected Work editorial spread. */
export const featuredAnchorProjectId = "vil-villa-12-bh" as const;

/** Supporting case studies — strong exteriors with real project names for a clean editorial grid. */
export const featuredProjectIds = [
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

export function getFeaturedAnchorProject(): Project | undefined {
  return projects.find((project) => project.id === featuredAnchorProjectId);
}

export function getFeaturedProjects(): Project[] {
  return featuredProjectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is Project => project != null);
}
