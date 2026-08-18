import type { StaticImageData } from "next/image";
import {
  exteriorTypeLabel,
  projectGalleryFormatSpecs,
  type Project,
  type ProjectGalleryFormat,
} from "@/lib/data";

const PORTRAIT_MAX_ASPECT = 0.92;

export type ProjectCardRatio = "landscape" | "portrait";

export type PortfolioSectionId = "interior" | "exterior";

export type ImageIntrinsic = {
  width: number;
  height: number;
  aspectRatio: string;
};

/** Pixel dimensions + CSS aspect-ratio for responsive full-frame project covers. */
export function resolveImageIntrinsic(
  image: string | StaticImageData,
  fallbackFormat: ProjectGalleryFormat = "cinema",
): ImageIntrinsic {
  if (typeof image !== "string") {
    const { width, height } = image;
    if (width > 0 && height > 0) {
      return { width, height, aspectRatio: `${width} / ${height}` };
    }
  }
  const spec = projectGalleryFormatSpecs[fallbackFormat];
  return {
    width: spec.width,
    height: spec.height,
    aspectRatio: `${spec.width} / ${spec.height}`,
  };
}

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
    return `Exterior · ${exteriorTypeLabel(project.exteriorType)}`;
  }
  return `Exterior · ${project.category}`;
}

export function getProjectCardDescription(project: Project): string {
  if (project.year && project.area) {
    return `${project.country} · ${project.year} · ${project.area}`;
  }
  if (project.year) return `${project.country} · ${project.year}`;
  return `${project.tag} — ${project.country}`;
}
