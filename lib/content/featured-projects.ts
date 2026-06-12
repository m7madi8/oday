import { projects, type Project } from "@/lib/data";

/** Curated homepage highlights — mix of exterior villas and interior work. */
export const featuredProjectIds = [
  "vil-hassan-salameh-27",
  "vil-baha-hamdallah-8",
  "vil-dr-baha-14",
  "in-baha-ahmad-7",
  "in-batool-10",
  "in-dr-salah-17",
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
