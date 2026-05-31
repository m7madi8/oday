"use client";

import { galleryHashToExteriorType } from "@/lib/gallery-anchors";
import type { ExteriorProjectType } from "@/lib/data";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function GalleryHashSync({
  onCategoryFromHash,
}: {
  onCategoryFromHash: (type: ExteriorProjectType) => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/gallery" && pathname !== "/projects") return;

    const applyHash = () => {
      const type = galleryHashToExteriorType(window.location.hash);
      if (type) onCategoryFromHash(type);
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [pathname, onCategoryFromHash]);

  return null;
}
