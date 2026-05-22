"use client";

import {
  isValidExteriorProjectType,
  isValidServiceSlug,
  type ExteriorProjectTypeFilter,
  type ProjectServiceFilter,
} from "@/lib/data";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
      router.replace("/projects?service=exterior&type=landscape", { scroll: false });
      onFilterChange("exterior", "landscape");
      return;
    }

    if (!rawService) {
      onFilterChange("All", "All");
      return;
    }

    if (isValidServiceSlug(rawService)) {
      const rawType = searchParams.get("type");
      const exteriorType: ExteriorProjectTypeFilter =
        rawService === "exterior" && rawType && isValidExteriorProjectType(rawType) ? rawType : "All";
      onFilterChange(rawService, exteriorType);
      return;
    }

    onFilterChange("All", "All");
    router.replace("/projects", { scroll: false });
  }, [searchParams, router, onFilterChange]);

  return null;
}
