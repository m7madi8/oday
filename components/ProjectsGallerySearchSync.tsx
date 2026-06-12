"use client";

import {
  defaultExteriorProjectType,
  isValidExteriorProjectType,
  isValidServiceSlug,
  type ExteriorProjectTypeFilter,
  type ProjectServiceFilter,
} from "@/lib/data";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function ProjectsGallerySearchSync({
  onFilterChange,
  basePath = "/projects",
}: {
  onFilterChange: (filter: ProjectServiceFilter, exteriorType: ExteriorProjectTypeFilter) => void;
  basePath?: "/projects" | "/gallery";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const rawService = searchParams.get("service");

    if (rawService === "landscape") {
      router.replace(`${basePath}?service=exterior&type=landscape`, { scroll: false });
      onFilterChange("exterior", "landscape");
      return;
    }

    if (!rawService) {
      if (basePath === "/gallery") return;
      onFilterChange("All", "All");
      return;
    }

    if (isValidServiceSlug(rawService)) {
      const rawType = searchParams.get("type");
      if (rawService === "exterior") {
        const exteriorType: ExteriorProjectTypeFilter =
          rawType && isValidExteriorProjectType(rawType) ? rawType : defaultExteriorProjectType;
        if (!rawType || !isValidExteriorProjectType(rawType)) {
          router.replace(`${basePath}?service=exterior&type=${exteriorType}`, { scroll: false });
        }
        onFilterChange("exterior", exteriorType);
        return;
      }
      onFilterChange(rawService, "All");
      return;
    }

    onFilterChange("All", "All");
    router.replace(basePath, { scroll: false });
  }, [basePath, searchParams, router, onFilterChange]);

  return null;
}
