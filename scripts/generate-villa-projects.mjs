/**
 * Generates lib/exterior-villa-projects.ts from imgs/Exterior/Villa/* folders.
 * Run: node scripts/generate-villa-projects.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const villaRoot = path.join(root, "imgs", "Exterior", "Villa");
const detailsFile = path.join(root, "lib", "exterior-villa-details.ts");
const outFile = path.join(root, "lib", "exterior-villa-projects.ts");

/** Parse villaProjectDetailsByOrder entries from the TS source (no TS runtime needed). */
function loadVillaDetailsByOrder() {
  const src = fs.readFileSync(detailsFile, "utf8");
  const map = {};
  const blockRe =
    /"(\d{2})":\s*\{([\s\S]*?)\n\s*\},/g;
  let match;
  while ((match = blockRe.exec(src))) {
    const order = match[1];
    const body = match[2];
    const field = (key) => {
      const m = body.match(new RegExp(`${key}:\\s*"((?:\\\\.|[^"\\\\])*)"`));
      if (m) return m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
      const multi = body.match(
        new RegExp(`${key}:\\s*\\n\\s*"((?:\\\\.|[^"\\\\])*)"`),
      );
      return multi ? multi[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : "";
    };
    // Support multiline string values in the details file
    const fieldFlexible = (key) => {
      const re = new RegExp(
        `${key}:\\s*((?:"(?:\\\\.|[^"\\\\])*")|(?:\\n\\s*"(?:\\\\.|[^"\\\\])*"))`,
      );
      const m = body.match(re);
      if (!m) return "";
      return m[1]
        .trim()
        .replace(/^"|"$/g, "")
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"');
    };
    map[order] = {
      name: fieldFlexible("name") || field("name"),
      projectType: fieldFlexible("projectType"),
      location: fieldFlexible("location"),
      year: fieldFlexible("year"),
      area: fieldFlexible("area"),
      concept: fieldFlexible("concept"),
      styleMaterials: fieldFlexible("styleMaterials"),
    };
  }
  return map;
}

function folderToSlug(folder) {
  const base = folder
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `vil-${base}`;
}

function pickCover(files) {
  const cover = files.find((f) => /^oday/i.test(f));
  if (cover) return cover;
  return [...files].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))[0];
}

function sortGallery(files, cover) {
  return [...files]
    .filter((f) => f !== cover)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function importVar(folderIndex, fileIndex) {
  return `vil${folderIndex}_img${fileIndex}`;
}

function posix(p) {
  return p.split(path.sep).join("/");
}

const detailsByOrder = loadVillaDetailsByOrder();

const folders = fs
  .readdirSync(villaRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (folders.length !== 12) {
  console.warn(`Expected 12 villa folders, found ${folders.length}.`);
}

const importLines = [];
const projectBlocks = [];
const galleryMaps = [];

folders.forEach((folder, folderIndex) => {
  const dir = path.join(villaRoot, folder);
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.webp$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (files.length === 0) {
    console.warn(`Skipping empty folder: ${folder}`);
    return;
  }

  const coverName = pickCover(files);
  const galleryNames = sortGallery(files, coverName);
  const ordered = [coverName, ...galleryNames];

  const vars = ordered.map((file, fileIndex) => {
    const v = importVar(folderIndex, fileIndex);
    const rel = posix(path.join("imgs", "Exterior", "Villa", folder, file));
    importLines.push(`import ${v} from "@/${rel}";`);
    return v;
  });

  const slug = folderToSlug(folder);
  const orderLabel = String(folderIndex + 1).padStart(2, "0");
  const details = detailsByOrder[orderLabel];
  const title = details?.name || orderLabel;
  const location = details?.location || "Palestine";
  const coverVar = vars[0];

  const optionalFields = [];
  if (details?.projectType) {
    optionalFields.push(`    projectType: ${JSON.stringify(details.projectType)},`);
  }
  if (details?.year) {
    optionalFields.push(`    year: ${JSON.stringify(details.year)},`);
  }
  if (details?.area) {
    optionalFields.push(`    area: ${JSON.stringify(details.area)},`);
  }
  if (details?.concept) {
    optionalFields.push(`    concept: ${JSON.stringify(details.concept)},`);
  }
  if (details?.styleMaterials) {
    optionalFields.push(`    styleMaterials: ${JSON.stringify(details.styleMaterials)},`);
  }

  projectBlocks.push(`  {
    id: ${JSON.stringify(slug)},
    orderLabel: ${JSON.stringify(orderLabel)},
    title: ${JSON.stringify(title)},
    country: ${JSON.stringify(location)},
    tag: "Villa Exterior",
    category: "Residential" as const,
    serviceSlug: "exterior" as const,
    exteriorType: "villas" as const,
${optionalFields.join("\n")}
    image: ${coverVar},
    imageAlt: ${JSON.stringify(`${title} — exterior visualization`)},
  },`);

  galleryMaps.push(`  [${JSON.stringify(slug)}]: [${vars.join(", ")}],`);
});

const content = `/* eslint-disable import/order */
// AUTO-GENERATED by scripts/generate-villa-projects.mjs — do not edit by hand.
import type { StaticImageData } from "next/image";

${importLines.join("\n")}

export const villaProjects = [
${projectBlocks.join("\n")}
];

const villaGalleryById: Record<string, StaticImageData[]> = {
${galleryMaps.join("\n")}
};

export function getVillaProjectGalleryImages(projectId: string): StaticImageData[] | undefined {
  return villaGalleryById[projectId];
}
`;

fs.writeFileSync(outFile, content, "utf8");
console.log(`Wrote ${outFile} (${folders.length} projects, ${importLines.length} images).`);
console.log(`Details matched: ${folders.filter((_, i) => detailsByOrder[String(i + 1).padStart(2, "0")]).length}/${folders.length}`);
