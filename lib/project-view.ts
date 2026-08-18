import { services } from "@/lib/content/services";
import { exteriorTypeLabel } from "@/lib/content/types";
import type {
  Project,
  ProjectDetailRow,
  ProjectGalleryFormat,
  ProjectServiceFilter,
} from "@/lib/data";

export function resolveProjectGalleryFormat(project: Project): ProjectGalleryFormat {
  if (project.galleryFormat) return project.galleryFormat;
  if (project.serviceSlug === "exterior") {
    return project.exteriorType === "residential-buildings" ? "cinema" : "instagram";
  }
  if (project.serviceSlug === "architecture-drone") return "cinema";
  if (project.serviceSlug === "architecture-ai") return "instagram";
  const n = Number.parseInt(project.orderLabel, 10);
  return Number.isFinite(n) && n % 2 === 0 ? "cinema" : "instagram";
}

export function serviceFilterLabel(filter: ProjectServiceFilter): string {
  if (filter === "All") return "All";
  const svc = services.find((s) => s.slug === filter);
  return svc?.title ?? filter;
}

export function getProjectSummary(project: Project): string {
  if (project.concept) return project.concept;
  return `${project.title} — ${project.tag} in ${project.country}. A ${project.category.toLowerCase()} engagement delivered through our ${serviceFilterLabel(project.serviceSlug)} line with documentation and coordination built for serious developers.`;
}

export function getProjectDetailRows(project: Project): ProjectDetailRow[] {
  if (project.projectType || project.year || project.area || project.styleMaterials) {
    const rows: ProjectDetailRow[] = [{ label: "Project name", value: project.title }];
    if (project.projectType) rows.push({ label: "Project type", value: project.projectType });
    rows.push({ label: "Location", value: project.country });
    if (project.year) rows.push({ label: "Year", value: project.year });
    if (project.area) rows.push({ label: "Area", value: project.area });
    rows.push({ label: "Case ref.", value: project.orderLabel });
    if (project.styleMaterials) {
      rows.push({ label: "Style & materials", value: project.styleMaterials, wide: true });
    }
    return rows;
  }

  const rows: ProjectDetailRow[] = [
    { label: "Location", value: project.country },
    { label: "Service line", value: serviceFilterLabel(project.serviceSlug) },
  ];
  if (project.serviceSlug === "exterior" && project.exteriorType) {
    rows.push({ label: "Exterior type", value: exteriorTypeLabel(project.exteriorType) });
  }
  rows.push(
    { label: "Category", value: project.category },
    { label: "Focus", value: project.tag },
    { label: "Case ref.", value: project.orderLabel },
  );
  return rows;
}

export function projectDetailPath(project: { id: string }): string {
  return `/projects/${project.id}`;
}

export type ProjectPagerLink = {
  id: string;
  title: string;
  country: string;
};

export type ProjectSiblings = {
  previous: ProjectPagerLink;
  next: ProjectPagerLink;
  position: number;
  total: number;
} | null;
