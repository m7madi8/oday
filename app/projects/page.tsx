import { ProjectsGallery } from "@/components/ProjectsGallery";
import {
  defaultExteriorProjectType,
  isValidExteriorProjectType,
  isValidServiceSlug,
  type ExteriorProjectTypeFilter,
  type ProjectServiceFilter,
} from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Gallery | OD ARCHITECTS",
  description:
    "Case studies across Exterior Design, Interior Design, Ai Design, and Architect Dron.",
};

export default function ProjectsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const rawService = typeof searchParams.service === "string" ? searchParams.service : undefined;
  const rawType = typeof searchParams.type === "string" ? searchParams.type : undefined;

  let initialFilter: ProjectServiceFilter = "All";
  let initialExteriorType: ExteriorProjectTypeFilter = "All";

  if (rawService === "landscape") {
    initialFilter = "exterior";
    initialExteriorType = "landscape";
  } else if (rawService && isValidServiceSlug(rawService)) {
    initialFilter = rawService;
    if (rawService === "exterior") {
      initialExteriorType =
        rawType && isValidExteriorProjectType(rawType) ? rawType : defaultExteriorProjectType;
    }
  }

  return (
    <ProjectsGallery initialFilter={initialFilter} initialExteriorType={initialExteriorType} />
  );
}
