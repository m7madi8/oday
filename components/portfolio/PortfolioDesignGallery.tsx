"use client";

import { PortfolioMasonrySection } from "@/components/portfolio/PortfolioMasonrySection";
import { GallerySectionTransition } from "@/components/animations/GalleryMotion";
import type { PortfolioSectionId } from "@/lib/project-card-ratio";
import { getProjectsByServiceSlug, type Project } from "@/lib/data";
import { useMemo } from "react";

export function PortfolioDesignGallery({
  sections,
  interiorProjects: interiorOverride,
  exteriorProjects: exteriorOverride,
}: {
  sections: PortfolioSectionId[];
  interiorProjects?: Project[];
  exteriorProjects?: Project[];
}) {
  const interiorProjects = useMemo(
    () => interiorOverride ?? getProjectsByServiceSlug("interior"),
    [interiorOverride],
  );
  const exteriorProjects = useMemo(
    () => exteriorOverride ?? getProjectsByServiceSlug("exterior"),
    [exteriorOverride],
  );

  const showInterior = sections.includes("interior");
  const showExterior = sections.includes("exterior");

  return (
    <div className="portfolio-design-gallery">
      {showInterior && (
        <GallerySectionTransition sectionKey="portfolio-interior">
          <PortfolioMasonrySection section="interior" projects={interiorProjects} />
        </GallerySectionTransition>
      )}
      {showExterior && (
        <GallerySectionTransition
          sectionKey="portfolio-exterior"
          className={showInterior ? "mt-16 md:mt-24" : undefined}
        >
          <PortfolioMasonrySection section="exterior" projects={exteriorProjects} />
        </GallerySectionTransition>
      )}
    </div>
  );
}
