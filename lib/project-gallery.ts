import type { StaticImageData } from "next/image";
import aboutImage from "@/imgs/Exterior/Villa/hASSAN SALAMEH 27/ODAY_result.webp";
import exteriorImage from "@/imgs/Exterior/Villa/villa 12 bh/ODAY_result.webp";
import interiorImage from "@/imgs/Interior/batool 10/ODAY_result.webp";
import landscapeImage from "@/imgs/Exterior/landscape/nibal school 46/oday_result.webp";
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
