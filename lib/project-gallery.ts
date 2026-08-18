import type { StaticImageData } from "next/image";
import aboutImage from "@/imgs/about.jpg";
import exteriorImage from "@/imgs/exterior.jpg";
import interiorImage from "@/imgs/interior.jpg";
import landscapeImage from "@/imgs/landscape.jpg";
import { cottageGalleryLoaders } from "@/lib/exterior-cottage-gallery-loaders";
import { landscapeGalleryLoaders } from "@/lib/exterior-landscape-gallery-loaders";
import { residentialGalleryLoaders } from "@/lib/exterior-residential-gallery-loaders";
import { villaGalleryLoaders } from "@/lib/exterior-villa-gallery-loaders";
import { interiorGalleryLoaders } from "@/lib/interior-gallery-loaders";
import type { Project, ProjectGalleryImage } from "@/lib/data";
import { resolveProjectGalleryFormat } from "@/lib/project-view";

const FALLBACK_COUNT = 20;

const projectGalleryPool = [interiorImage, exteriorImage, landscapeImage, aboutImage] as const;

const galleryLoaders = {
  ...interiorGalleryLoaders,
  ...villaGalleryLoaders,
  ...residentialGalleryLoaders,
  ...cottageGalleryLoaders,
  ...landscapeGalleryLoaders,
};

function toFrames(project: Project, folderImages?: StaticImageData[]): ProjectGalleryImage[] {
  const format = resolveProjectGalleryFormat(project);
  if (folderImages?.length) {
    const total = folderImages.length;
    return folderImages.map((src, i) => ({
      src,
      alt: `${project.title} — gallery frame ${String(i + 1).padStart(2, "0")} of ${total}`,
      format,
    }));
  }
  return Array.from({ length: FALLBACK_COUNT }, (_, i) => ({
    src: projectGalleryPool[i % projectGalleryPool.length],
    alt: `${project.title} — gallery frame ${String(i + 1).padStart(2, "0")} of ${FALLBACK_COUNT}`,
    format,
  }));
}

/** Loads only this project's frames — never the rest of the archive. */
export async function getProjectGallery(project: Project): Promise<ProjectGalleryImage[]> {
  const load = galleryLoaders[project.id];
  const folderImages = load ? await load() : undefined;
  return toFrames(project, folderImages);
}

export function coverAsGallery(project: Project): ProjectGalleryImage[] {
  return [
    {
      src: project.image,
      alt: project.imageAlt,
      format: resolveProjectGalleryFormat(project),
    },
  ];
}
