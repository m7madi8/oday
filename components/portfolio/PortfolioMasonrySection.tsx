"use client";

import { PortfolioMasonryRowView } from "@/components/portfolio/PortfolioMasonryRow";
import { GalleryGoldLine, GalleryReveal } from "@/components/animations/GalleryMotion";
import { buildPortfolioMasonryRows } from "@/lib/portfolio-masonry-layout";
import type { PortfolioSectionId } from "@/lib/project-card-ratio";
import type { Project } from "@/lib/data";
import { useEffect, useMemo, useRef, useState } from "react";

const INITIAL_VISIBLE_ROWS = 4;
const ROWS_PER_PAGE = 4;

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
  const rows = useMemo(() => buildPortfolioMasonryRows(projects), [projects]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_ROWS);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_ROWS);
  }, [projects]);

  useEffect(() => {
    if (visibleCount >= rows.length) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => Math.min(count + ROWS_PER_PAGE, rows.length));
        }
      },
      { rootMargin: "900px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visibleCount, rows.length]);

  if (projects.length === 0) return null;

  const visibleRows = rows.slice(0, visibleCount);

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

      <div className="portfolio-masonry-rows">
        {visibleRows.map((row, index) => (
          <PortfolioMasonryRowView key={`${row.kind}-${index}`} row={row} section={section} />
        ))}
      </div>
      {visibleCount < rows.length ? (
        <div ref={sentinelRef} className="h-px w-full" aria-hidden />
      ) : null}
    </section>
  );
}
