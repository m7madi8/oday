"use client";

import { PortfolioProjectCard } from "@/components/portfolio/PortfolioProjectCard";
import type { PortfolioMasonryRow as Row } from "@/lib/portfolio-masonry-layout";
import type { PortfolioSectionId } from "@/lib/project-card-ratio";

const ROW_CLASS: Record<Row["kind"], string> = {
  "featured-trio": "portfolio-row portfolio-row--featured-trio",
  "featured-trio-reverse": "portfolio-row portfolio-row--featured-trio portfolio-row--featured-trio-reverse",
  "twin-landscape": "portfolio-row portfolio-row--twin-landscape",
  "quad-portrait": "portfolio-row portfolio-row--quad-portrait",
  "pair-portrait": "portfolio-row portfolio-row--pair-portrait",
  "solo-landscape": "portfolio-row portfolio-row--solo-landscape",
  "solo-portrait": "portfolio-row portfolio-row--solo-portrait",
};

export function PortfolioMasonryRowView({
  row,
  section,
}: {
  row: Row;
  section: PortfolioSectionId;
}) {
  const className = ROW_CLASS[row.kind];

  switch (row.kind) {
    case "featured-trio":
      return (
        <div className={className} role="list">
          <PortfolioProjectCard project={row.landscape} section={section} ratio="landscape" />
          <PortfolioProjectCard project={row.portraits[0]} section={section} ratio="portrait" />
          <PortfolioProjectCard project={row.portraits[1]} section={section} ratio="portrait" />
        </div>
      );
    case "featured-trio-reverse":
      return (
        <div className={className} role="list">
          <PortfolioProjectCard project={row.portraits[0]} section={section} ratio="portrait" />
          <PortfolioProjectCard project={row.portraits[1]} section={section} ratio="portrait" />
          <PortfolioProjectCard project={row.landscape} section={section} ratio="landscape" />
        </div>
      );
    case "twin-landscape":
      return (
        <div className={className} role="list">
          <PortfolioProjectCard project={row.landscapes[0]} section={section} ratio="landscape" />
          <PortfolioProjectCard project={row.landscapes[1]} section={section} ratio="landscape" />
        </div>
      );
    case "quad-portrait":
      return (
        <div className={className} role="list">
          {row.portraits.map((project) => (
            <PortfolioProjectCard key={project.id} project={project} section={section} ratio="portrait" />
          ))}
        </div>
      );
    case "pair-portrait":
      return (
        <div className={className} role="list">
          <PortfolioProjectCard project={row.portraits[0]} section={section} ratio="portrait" />
          <PortfolioProjectCard project={row.portraits[1]} section={section} ratio="portrait" />
        </div>
      );
    case "solo-landscape":
      return (
        <div className={className} role="list">
          <PortfolioProjectCard project={row.landscape} section={section} ratio="landscape" />
        </div>
      );
    case "solo-portrait":
      return (
        <div className={className} role="list">
          <PortfolioProjectCard project={row.portrait} section={section} ratio="portrait" />
        </div>
      );
  }
}
