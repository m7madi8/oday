import type { Project } from "@/lib/data";
import type { GalleryCardTone } from "@/lib/project-card-ratio";

export type GalleryBandKind =
  | "wide-cell"
  | "cell-wide"
  | "trio"
  | "pair"
  | "solo"
  | "solo-hero";

export type GalleryBandCell = {
  project: Project;
  tone: GalleryCardTone;
  span: 4 | 6 | 8 | 12;
};

export type GalleryBand = {
  kind: GalleryBandKind;
  cells: GalleryBandCell[];
};

export const GALLERY_LEAD_PROJECT_ID = "vil-villa-12-bh";

const EXTERIOR_OPENING_PAIR = ["res-hamada-25", "res-luay-jeris-35"] as const;
export const EXTERIOR_FEATURE_SPOTLIGHT_ID = "lsc-ghazi-el-bazzar-24";
const EXTERIOR_LJ_COMPANION_COUNT = 2;
/** Full-width AL-BAZZAR hero rows placed after the opening sequence. */
const EXTERIOR_HERO_AFTER_BANDS = 1;
const EXTERIOR_DEFERRED_TAIL_IDS = [
  "vil-abu-falah-2-option-villa-4",
  "vil-baha-hamdallah-8",
] as const;
const EXTERIOR_PROMOTED_AFTER_OPENING_IDS = [
  "vil-nasim-shawahneh-42",
  "vil-villa-taim",
] as const;

/** Keep a lead project first without dropping the rest of the archive. */
export function leadGalleryProjects(projects: Project[], leadId = GALLERY_LEAD_PROJECT_ID): Project[] {
  const lead = projects.find((project) => project.id === leadId);
  if (!lead) return projects;
  return [lead, ...projects.filter((project) => project.id !== leadId)];
}

function pinExteriorGalleryTail(rest: Project[]): Project[] {
  const deferred = EXTERIOR_DEFERRED_TAIL_IDS.map((id) => rest.find((project) => project.id === id)).filter(
    (project): project is Project => project != null,
  );
  const promoted = EXTERIOR_PROMOTED_AFTER_OPENING_IDS.map((id) =>
    rest.find((project) => project.id === id),
  ).filter((project): project is Project => project != null);
  const pinnedIds = new Set<string>([...EXTERIOR_DEFERRED_TAIL_IDS, ...EXTERIOR_PROMOTED_AFTER_OPENING_IDS]);
  const middle = rest.filter((project) => !pinnedIds.has(project.id));
  const head = middle.slice(0, EXTERIOR_LJ_COMPANION_COUNT);

  return [...head, ...promoted, ...middle.slice(EXTERIOR_LJ_COMPANION_COUNT), ...deferred];
}

/** Exterior archive — lead, then R. LINE (01) before L. J (02). */
export function orderExteriorGalleryProjects(projects: Project[]): Project[] {
  const withLead = leadGalleryProjects(projects);
  const lead = withLead.find((project) => project.id === GALLERY_LEAD_PROJECT_ID);
  const opening = EXTERIOR_OPENING_PAIR.map((id) =>
    withLead.find((project) => project.id === id),
  ).filter((project): project is Project => project != null);
  const rest = withLead.filter(
    (project) =>
      project.id !== GALLERY_LEAD_PROJECT_ID &&
      !EXTERIOR_OPENING_PAIR.includes(project.id as (typeof EXTERIOR_OPENING_PAIR)[number]),
  );

  return [...(lead ? [lead] : []), ...opening, ...pinExteriorGalleryTail(rest)];
}

function buildExteriorOpeningBands(stream: Project[]): { bands: GalleryBand[]; consumed: number } {
  const bands: GalleryBand[] = [];
  const [lead, rLine, lJ, ...afterLJ] = stream;
  const companions = afterLJ.slice(0, EXTERIOR_LJ_COMPANION_COUNT);

  if (lead && rLine) {
    bands.push({
      kind: "wide-cell",
      cells: [
        { project: lead, tone: "wide", span: 8 },
        { project: rLine, tone: "plate", span: 4 },
      ],
    });
  }

  if (lJ && companions.length === EXTERIOR_LJ_COMPANION_COUNT) {
    bands.push({
      kind: "trio",
      cells: [
        { project: lJ, tone: "frame", span: 4 },
        { project: companions[0], tone: "index", span: 4 },
        { project: companions[1], tone: "flush", span: 4 },
      ],
    });
    return { bands, consumed: 3 + companions.length };
  }

  if (lJ && companions.length === 1) {
    bands.push({
      kind: "cell-wide",
      cells: [
        { project: lJ, tone: "plate", span: 4 },
        { project: companions[0], tone: "wide", span: 8 },
      ],
    });
    return { bands, consumed: 4 };
  }

  if (lJ) {
    bands.push({
      kind: "solo",
      cells: [{ project: lJ, tone: "wide", span: 12 }],
    });
    return { bands, consumed: 3 };
  }

  return { bands, consumed: lead && rLine ? 2 : 0 };
}

/** Exterior archive bands — opening rows, a short run, then AL-BAZZAR large, then the rest. */
export function buildExteriorGalleryBands(projects: Project[]): GalleryBand[] {
  const ordered = orderExteriorGalleryProjects(projects);
  const hero = ordered.find((project) => project.id === EXTERIOR_FEATURE_SPOTLIGHT_ID);
  const stream = ordered.filter((project) => project.id !== EXTERIOR_FEATURE_SPOTLIGHT_ID);
  const { bands: openingBands, consumed } = buildExteriorOpeningBands(stream);
  const restBands = buildGalleryBands(stream.slice(consumed));

  if (!hero) {
    return [...openingBands, ...restBands];
  }

  const heroBand: GalleryBand = {
    kind: "solo-hero",
    cells: [{ project: hero, tone: "wide", span: 12 }],
  };

  const offset = Math.min(EXTERIOR_HERO_AFTER_BANDS, restBands.length);
  const beforeHero = restBands.slice(0, offset);
  const afterHero = restBands.slice(offset);

  return [...openingBands, ...beforeHero, heroBand, ...afterHero];
}

/**
 * Editorial bento — mixed spans, not a uniform grid.
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
