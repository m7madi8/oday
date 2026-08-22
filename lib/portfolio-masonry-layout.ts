import type { Project } from "@/lib/data";
import type { GalleryCardTone } from "@/lib/project-card-ratio";

export type GalleryBandKind = "wide-cell" | "cell-wide" | "trio" | "pair" | "solo";

export type GalleryBandCell = {
  project: Project;
  tone: GalleryCardTone;
  span: 4 | 6 | 8 | 12;
};

export type GalleryBand = {
  kind: GalleryBandKind;
  cells: GalleryBandCell[];
};

/**
 * Packs projects into complete 12-unit rows.
 * Pattern: 8+4 → 4+4+4 → 4+8, then leftover 6+6 or 12.
 */
export function buildGalleryBands(projects: Project[]): GalleryBand[] {
  const bands: GalleryBand[] = [];
  let i = 0;
  let cycle = 0;

  while (i < projects.length) {
    const left = projects.length - i;
    const pattern = cycle % 3;

    if (left >= 2 && pattern === 0) {
      bands.push({
        kind: "wide-cell",
        cells: [
          { project: projects[i], tone: "wide", span: 8 },
          { project: projects[i + 1], tone: "plate", span: 4 },
        ],
      });
      i += 2;
      cycle += 1;
      continue;
    }

    if (left >= 3 && pattern === 1) {
      bands.push({
        kind: "trio",
        cells: [
          { project: projects[i], tone: "frame", span: 4 },
          { project: projects[i + 1], tone: "index", span: 4 },
          { project: projects[i + 2], tone: "flush", span: 4 },
        ],
      });
      i += 3;
      cycle += 1;
      continue;
    }

    if (left >= 2 && pattern === 2) {
      bands.push({
        kind: "cell-wide",
        cells: [
          { project: projects[i], tone: "plate", span: 4 },
          { project: projects[i + 1], tone: "wide", span: 8 },
        ],
      });
      i += 2;
      cycle += 1;
      continue;
    }

    if (left === 2) {
      bands.push({
        kind: "pair",
        cells: [
          { project: projects[i], tone: "plate", span: 6 },
          { project: projects[i + 1], tone: "frame", span: 6 },
        ],
      });
      break;
    }

    bands.push({
      kind: "solo",
      cells: [{ project: projects[i], tone: "wide", span: 12 }],
    });
    i += 1;
  }

  return bands;
}
