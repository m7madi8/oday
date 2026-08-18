/**
 * Generates lib/exterior-residential-projects.ts from imgs/Exterior/residential building/*.
 * Run: node scripts/generate-residential-projects.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeGeneratedProjectModules } from "./lib/write-generated-projects.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const buildingRoot = path.join(root, "imgs", "Exterior", "residential building");
const detailsFile = path.join(root, "lib", "exterior-residential-details.ts");
const outFile = path.join(root, "lib", "exterior-residential-projects.ts");
const loadersFile = path.join(root, "lib", "exterior-residential-gallery-loaders.ts");

/** Client case order for alphabetical folders: 01, 03, 02, 04, 05, 06, 07, 08 */
const FOLDER_ORDER_LABELS = ["01", "03", "02", "04", "05", "06", "07", "08"];

function loadDetailsByOrder() {
  const src = fs.readFileSync(detailsFile, "utf8");
  const map = {};
  const blockRe = /"(\d{2})":\s*\{([\s\S]*?)\n\s*\},/g;
  let match;
  while ((match = blockRe.exec(src))) {
    const order = match[1];
    const body = match[2];
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
      name: fieldFlexible("name"),
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
  return `res-${base}`;
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
  return `rb${folderIndex}_img${fileIndex}`;
}

function posix(p) {
  return p.split(path.sep).join("/");
}

const detailsByOrder = loadDetailsByOrder();

const folders = fs
  .readdirSync(buildingRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (folders.length !== 8) {
  console.warn(`Expected 8 residential building folders, found ${folders.length}.`);
}

const importLines = [];
const coverImportLines = [];
const projectBlocks = [];
const galleryEntries = [];

folders.forEach((folder, folderIndex) => {
  const dir = path.join(buildingRoot, folder);
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

  const projectImportLines = [];
  const vars = ordered.map((file, fileIndex) => {
    const v = importVar(folderIndex, fileIndex);
    const rel = posix(path.join("imgs", "Exterior", "residential building", folder, file));
    const line = `import ${v} from "@/${rel}";`;
    importLines.push(line);
    projectImportLines.push(line);
    if (fileIndex === 0) coverImportLines.push(line);
    return v;
  });

  const slug = folderToSlug(folder);
  const orderLabel =
    FOLDER_ORDER_LABELS[folderIndex] || String(folderIndex + 1).padStart(2, "0");
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
    tag: "Residential Building",
    category: "Residential" as const,
    serviceSlug: "exterior" as const,
    exteriorType: "residential-buildings" as const,
${optionalFields.join("\n")}
    image: ${coverVar},
    imageAlt: ${JSON.stringify(`${title} — exterior visualization`)},
  },`);

  galleryEntries.push({
    id: slug,
    importLines: projectImportLines,
    varNames: vars,
  });
});

writeGeneratedProjectModules({
  banner: "scripts/generate-residential-projects.mjs",
  projectsFile: outFile,
  loadersFile,
  loadersExportName: "residentialGalleryLoaders",
  coverImportLines,
  projectsConstName: "residentialBuildingProjects",
  projectBlocks,
  galleryEntries,
});
console.log(`Wrote ${outFile} + ${loadersFile} (${folders.length} projects, ${coverImportLines.length} covers, ${importLines.length} images).`);
console.log(
  `Order labels: ${folders
    .map((_, i) => FOLDER_ORDER_LABELS[i] || "?")
    .join(", ")}`,
);
