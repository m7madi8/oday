"use client";

import {
  isValidExteriorProjectType,
  isValidServiceSlug,
  type ExteriorProjectTypeFilter,
  type ProjectServiceFilter,
} from "@/lib/data";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ARCHIVE_PATH = "/projects";

/** Mirrors `?service=` / `?type=` into gallery filter state so deep links and Back both work. */
export function ProjectsGallerySearchSync({
  onFilterChange,
}: {
  onFilterChange: (filter: ProjectServiceFilter, exteriorType: ExteriorProjectTypeFilter) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const rawService = searchParams.get("service");

    if (rawService === "landscape") {
      router.replace(`${ARCHIVE_PATH}?service=exterior&type=landscape`, { scroll: false });
      onFilterChange("exterior", "landscape");
      return;
    }

    if (!rawService) {
      onFilterChange("All", "All");
      return;
    }

    if (isValidServiceSlug(rawService)) {
      if (rawService === "exterior") {
        const rawType = searchParams.get("type");
        // No type means the whole exterior body of work, not one collection.
        onFilterChange(
          "exterior",
          rawType && isValidExteriorProjectType(rawType) ? rawType : "All",
        );
        return;
      }
      onFilterChange(rawService, "All");
      return;
    }

    onFilterChange("All", "All");
    router.replace(ARCHIVE_PATH, { scroll: false });
  }, [searchParams, router, onFilterChange]);

  return null;
}
