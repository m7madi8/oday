import { resolveProjectGalleryFormat, type Project } from "@/lib/data";
import { resolveProjectCardRatio, type ProjectCardRatio } from "@/lib/project-card-ratio";

export type PortfolioMasonryRow =
  | { kind: "featured-trio"; landscape: Project; portraits: [Project, Project] }
  | { kind: "featured-trio-reverse"; portraits: [Project, Project]; landscape: Project }
  | { kind: "twin-landscape"; landscapes: [Project, Project] }
  | { kind: "quad-portrait"; portraits: [Project, Project, Project, Project] }
  | { kind: "pair-portrait"; portraits: [Project, Project] }
  | { kind: "solo-landscape"; landscape: Project }
  | { kind: "solo-portrait"; portrait: Project };

export function getProjectCardRatio(project: Project): ProjectCardRatio {
  const format = resolveProjectGalleryFormat(project);
  return resolveProjectCardRatio(project.image, format);
}

/** Groups projects into fixed rows so portrait + landscape tiles align without grid holes. */
export function buildPortfolioMasonryRows(projects: Project[]): PortfolioMasonryRow[] {
  const portraits: Project[] = [];
  const landscapes: Project[] = [];

  for (const project of projects) {
    if (getProjectCardRatio(project) === "portrait") {
      portraits.push(project);
    } else {
      landscapes.push(project);
    }
  }

  const rows: PortfolioMasonryRow[] = [];
  let pi = 0;
  let li = 0;

  while (li < landscapes.length && pi + 1 < portraits.length) {
    const pair = [portraits[pi], portraits[pi + 1]] as [Project, Project];
    if (rows.length % 2 === 0) {
      rows.push({ kind: "featured-trio", landscape: landscapes[li], portraits: pair });
    } else {
      rows.push({ kind: "featured-trio-reverse", portraits: pair, landscape: landscapes[li] });
    }
    pi += 2;
    li += 1;
  }

  while (li + 1 < landscapes.length) {
    rows.push({
      kind: "twin-landscape",
      landscapes: [landscapes[li], landscapes[li + 1]],
    });
    li += 2;
  }

  while (pi + 3 < portraits.length) {
    rows.push({
      kind: "quad-portrait",
      portraits: [portraits[pi], portraits[pi + 1], portraits[pi + 2], portraits[pi + 3]],
    });
    pi += 4;
  }

  while (pi + 1 < portraits.length) {
    rows.push({ kind: "pair-portrait", portraits: [portraits[pi], portraits[pi + 1]] });
    pi += 2;
  }

  if (li < landscapes.length) {
    rows.push({ kind: "solo-landscape", landscape: landscapes[li] });
    li += 1;
  }

  if (pi < portraits.length) {
    rows.push({ kind: "solo-portrait", portrait: portraits[pi] });
    pi += 1;
  }

  return rows;
}
