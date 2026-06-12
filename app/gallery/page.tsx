import { GalleryPageView } from "@/components/GalleryPageView";
import {
  isValidExteriorProjectType,
  type ExteriorProjectTypeFilter,
} from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Gallery | OD ARCHITECTS",
  description:
    "Case studies across Exterior Design, Interior Design, Ai Design, and Architect Dron.",
};

export default function GalleryPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const rawType = typeof searchParams.type === "string" ? searchParams.type : undefined;

  let initialExteriorType: ExteriorProjectTypeFilter = "villas";

  if (rawType && isValidExteriorProjectType(rawType)) {
    initialExteriorType = rawType;
  }

  return (
    <GalleryPageView
      basePath="/gallery"
      initialFilter="exterior"
      initialExteriorType={initialExteriorType}
    />
  );
}
