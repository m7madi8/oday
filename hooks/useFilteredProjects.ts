"use client";

import {
  exteriorProjectTypes,
  exteriorTypeLabel,
  getExteriorProjectCount,
  projects,
  type ExteriorProjectType,
  type ExteriorProjectTypeFilter,
  type Project,
  type ProjectCategory,
  type ProjectServiceFilter,
} from "@/lib/data";
import { useMemo } from "react";

export type GalleryCategoryFilter = ExteriorProjectTypeFilter | ProjectCategory | "All";

export const EXTERIOR_CATEGORY_SHORT: Record<ExteriorProjectType, string> = {
  villas: "Villas",
  "residential-buildings": "Resid.",
  cottage: "Cottage",
  landscape: "Land.",
  general: "General",
};

export const PROJECT_CATEGORIES: ProjectCategory[] = ["Residential", "Cultural"];

export function getCategoryOptions(service: ProjectServiceFilter): GalleryCategoryFilter[] {
  if (service === "All") return ["All"];
  if (service === "exterior") return ["All", ...exteriorProjectTypes];
  return ["All", ...PROJECT_CATEGORIES];
}

export function categoryFilterLabel(
  service: ProjectServiceFilter,
  category: GalleryCategoryFilter,
): string {
  if (category === "All") return "All";
  if (service === "exterior" && category !== "Residential" && category !== "Cultural") {
    return exteriorTypeLabel(category as ExteriorProjectType);
  }
  return category;
}

function matchesCategory(project: Project, service: ProjectServiceFilter, category: GalleryCategoryFilter) {
  if (category === "All") return true;
  if (service === "exterior") {
    return project.exteriorType === category;
  }
  return project.category === category;
}

export function countProjectsForCategory(
  service: ProjectServiceFilter,
  category: GalleryCategoryFilter,
): number {
  if (service === "All") return projects.length;
  if (service === "exterior" && category !== "All" && category !== "Residential" && category !== "Cultural") {
    return getExteriorProjectCount(category as ExteriorProjectType);
  }
  return projects.filter(
    (p) => p.serviceSlug === service && matchesCategory(p, service, category),
  ).length;
}

export function countProjectsForService(service: ProjectServiceFilter): number {
  if (service === "All") return projects.length;
  return projects.filter((p) => p.serviceSlug === service).length;
}

export function useFilteredProjects(
  service: ProjectServiceFilter,
  category: GalleryCategoryFilter,
): Project[] {
  return useMemo(() => {
    if (service === "All") return projects;
    return projects.filter(
      (p) => p.serviceSlug === service && matchesCategory(p, service, category),
    );
  }, [service, category]);
}

export function useCategoryCounts(service: ProjectServiceFilter): Record<string, number> {
  return useMemo(() => {
    const options = getCategoryOptions(service);
    return Object.fromEntries(
      options.map((cat) => [cat, countProjectsForCategory(service, cat)]),
    );
  }, [service]);
}
