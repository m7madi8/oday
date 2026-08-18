import { getSiteSections, type SearchEntry } from "@/lib/content/site-navigation";
import { services } from "@/lib/content/services";
import type { ServiceSlug } from "@/lib/content/types";
import { projects } from "@/lib/data";

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const project of projects) {
    const keywords = [
      project.title,
      project.tag,
      project.country,
      project.category,
      project.serviceSlug,
      project.exteriorType ?? "",
      project.projectType ?? "",
      project.year ?? "",
      project.orderLabel,
    ]
      .filter(Boolean)
      .map((k) => k.toLowerCase());

    entries.push({
      id: `project-${project.id}`,
      group: "Projects",
      title: project.title,
      subtitle: [project.tag, project.country].filter(Boolean).join(" · "),
      href: `/projects/${project.id}`,
      keywords,
    });
  }

  for (const service of services) {
    entries.push({
      id: `service-${service.slug}`,
      group: "Services",
      title: service.title,
      subtitle: service.description,
      href: `/projects?service=${encodeURIComponent(service.slug as ServiceSlug)}`,
      keywords: [service.title, service.description, service.slug, "gallery", "projects"].map((k) =>
        k.toLowerCase(),
      ),
    });
  }

  for (const section of getSiteSections()) {
    entries.push({
      id: `section-${section.id}`,
      group: "Sections",
      title: section.label,
      subtitle: section.description,
      href: section.href,
      keywords: [section.label, section.description, section.id].map((k) => k.toLowerCase()),
    });
  }

  return entries;
}

export function filterSearchIndex(query: string, index: SearchEntry[]): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);

  return index
    .map((entry) => {
      const hay = [entry.title, entry.subtitle ?? "", ...entry.keywords].join(" ").toLowerCase();
      const score = tokens.reduce((acc, token) => {
        if (entry.title.toLowerCase().includes(token)) return acc + 6;
        if (hay.includes(token)) return acc + 2;
        return acc;
      }, 0);
      return { entry, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, 24)
    .map((row) => row.entry);
}
