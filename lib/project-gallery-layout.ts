import type { StaticImageData } from "next/image";
import { projectGalleryAspect, type ProjectGalleryFormat } from "@/lib/data";

export type GalleryImageDimensions = {
  width: number;
  height: number;
  aspect: number;
};

export function resolveGalleryImageDimensions(
  src: string | StaticImageData,
  format: ProjectGalleryFormat,
): GalleryImageDimensions {
  if (typeof src !== "string" && src.width > 0 && src.height > 0) {
    return {
      width: src.width,
      height: src.height,
      aspect: src.width / src.height,
    };
  }

  const aspect = projectGalleryAspect(format);
  const refW = 1200;
  const refH = Math.round(refW / aspect);
  return { width: refW, height: refH, aspect };
}

/** Pixel size for a gallery card — fits image aspect, capped for viewport. */
export function getGalleryCardSize(
  dims: GalleryImageDimensions,
  opts?: { maxHeight?: number; maxWidth?: number },
): { width: number; height: number } {
  const maxH = opts?.maxHeight ?? 480;
  const maxW = opts?.maxWidth ?? 720;

  let height = maxH;
  let width = Math.round(height * dims.aspect);

  if (width > maxW) {
    width = maxW;
    height = Math.round(width / dims.aspect);
  }

  return { width, height };
}
