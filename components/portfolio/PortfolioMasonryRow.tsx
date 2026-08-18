"use client";

import { ProjectCard } from "@/components/ProjectCard";
import type { PortfolioMasonryRow as Row } from "@/lib/portfolio-masonry-layout";
import type { PortfolioSectionId } from "@/lib/project-card-ratio";
import type { Project } from "@/lib/data";
import type { ProjectCardRatio } from "@/lib/project-card-ratio";

const ROW_CLASS: Record<Row["kind"], string> = {
  "featured-trio": "portfolio-row portfolio-row--featured-trio",
  "featured-trio-reverse": "portfolio-row portfolio-row--featured-trio portfolio-row--featured-trio-reverse",
  "twin-landscape": "portfolio-row portfolio-row--twin-landscape",
  "quad-portrait": "portfolio-row portfolio-row--quad-portrait",
  "pair-portrait": "portfolio-row portfolio-row--pair-portrait",
  "solo-landscape": "portfolio-row portfolio-row--solo-landscape",
  "solo-portrait": "portfolio-row portfolio-row--solo-portrait",
};

/** Row cells are always masonry cards — only the project and locked ratio vary. */
function cells(row: Row): Array<{ project: Project; ratio: ProjectCardRatio }> {
  switch (row.kind) {
    case "featured-trio":
      return [
        { project: row.landscape, ratio: "landscape" },
        { project: row.portraits[0], ratio: "portrait" },
        { project: row.portraits[1], ratio: "portrait" },
      ];
    case "featured-trio-reverse":
      return [
        { project: row.portraits[0], ratio: "portrait" },
        { project: row.portraits[1], ratio: "portrait" },
        { project: row.landscape, ratio: "landscape" },
      ];
    case "twin-landscape":
      return row.landscapes.map((project) => ({ project, ratio: "landscape" as const }));
    case "quad-portrait":
    case "pair-portrait":
      return row.portraits.map((project) => ({ project, ratio: "portrait" as const }));
    case "solo-landscape":
      return [{ project: row.landscape, ratio: "landscape" }];
    case "solo-portrait":
      return [{ project: row.portrait, ratio: "portrait" }];
  }
}

export function PortfolioMasonryRowView({
  row,
  section,
}: {
  row: Row;
  section: PortfolioSectionId;
}) {
  return (
    <div className={ROW_CLASS[row.kind]} role="list">
      {cells(row).map(({ project, ratio }) => (
        <ProjectCard
          key={project.id}
          project={project}
          variant="masonry"
          section={section}
          ratio={ratio}
        />
      ))}
    </div>
  );
}
