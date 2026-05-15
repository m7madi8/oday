import { ProjectsGallery } from "@/components/ProjectsGallery";
import { isValidServiceSlug, type ProjectServiceFilter } from "@/lib/data";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Project Gallery | OD STUDIO",
  description:
    "Case studies across interior, landscape, exterior, architecture drone, and architecture AI.",
};

export default function ProjectsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const raw = typeof searchParams.service === "string" ? searchParams.service : undefined;
  const initialFilter: ProjectServiceFilter =
    raw && isValidServiceSlug(raw) ? raw : "All";

  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] bg-bg-primary pt-[calc(var(--hero-nav-stack)+2rem)]" aria-hidden />
      }
    >
      <ProjectsGallery initialFilter={initialFilter} />
    </Suspense>
  );
}
