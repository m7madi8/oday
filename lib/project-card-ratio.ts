import type { StaticImageData } from "next/image";
import type { ExteriorProjectType, Project, ProjectGalleryFormat } from "@/lib/data";

const EXTERIOR_TYPE_LABELS: Record<ExteriorProjectType, string> = {
  villas: "Villas",
  "residential-buildings": "Residential Buildings",
  cottage: "Cottage",
  landscape: "Landscape",
};

const PORTRAIT_MAX_ASPECT = 0.92;

export type ProjectCardRatio = "landscape" | "portrait";

export type PortfolioSectionId = "interior" | "exterior";

export function resolveProjectCardRatio(
  image: string | StaticImageData,
  galleryFormat?: ProjectGalleryFormat,
): ProjectCardRatio {
  if (typeof image !== "string") {
    const { width, height } = image;
    if (width > 0 && height > 0) {
      const aspect = width / height;
      if (aspect <= PORTRAIT_MAX_ASPECT) return "portrait";
      return "landscape";
    }
  }
  if (galleryFormat === "cinema") return "landscape";
  return "landscape";
}

export function getProjectCardPill(project: Project, section: PortfolioSectionId): string {
  if (section === "interior") {
    return "Interior";
  }
  if (project.exteriorType) {
    return `Exterior · ${EXTERIOR_TYPE_LABELS[project.exteriorType]}`;
  }
  return `Exterior · ${project.category}`;
}

export function getProjectCardDescription(project: Project): string {
  return `${project.tag} — ${project.country}`;
}
