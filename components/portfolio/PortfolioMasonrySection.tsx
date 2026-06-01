"use client";

import { PortfolioProjectCard } from "@/components/portfolio/PortfolioProjectCard";
import { GalleryGoldLine, GalleryReveal } from "@/components/animations/GalleryMotion";
import type { PortfolioSectionId } from "@/lib/project-card-ratio";
import type { Project } from "@/lib/data";

const SECTION_COPY: Record<
  PortfolioSectionId,
  { title: string; subtitle: string }
> = {
  interior: {
    title: "Interior Design",
    subtitle: "Residential, hospitality, and commercial interiors — curated case studies.",
  },
  exterior: {
    title: "Exterior Design",
    subtitle: "Villas, buildings, landscape, and facade studies across Palestine.",
  },
};

export function PortfolioMasonrySection({
  section,
  projects,
  className = "",
}: {
  section: PortfolioSectionId;
  projects: Project[];
  className?: string;
}) {
  const copy = SECTION_COPY[section];

  if (projects.length === 0) return null;

  return (
    <section
      className={`portfolio-section ${className}`.trim()}
      data-section={section}
      aria-labelledby={`portfolio-heading-${section}`}
    >
      <GalleryReveal>
        <header className="portfolio-section__header">
          <p className="portfolio-section__eyebrow label-upper">Portfolio</p>
          <h2 id={`portfolio-heading-${section}`} className="portfolio-section__title">
            {copy.title}
          </h2>
          <p className="portfolio-section__subtitle">{copy.subtitle}</p>
          <GalleryGoldLine className="portfolio-section__rule mt-6 max-w-xs" />
        </header>
      </GalleryReveal>

      <div className="portfolio-masonry" role="list">
        {projects.map((project) => (
          <div key={project.id} className="portfolio-masonry__cell" role="listitem">
            <PortfolioProjectCard project={project} section={section} />
          </div>
        ))}
      </div>
    </section>
  );
}
