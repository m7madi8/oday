/**
 * Generates lib/exterior-landscape-projects.ts from imgs/Exterior/landscape/*.
 * Run: node scripts/generate-landscape-projects.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeGeneratedProjectModules } from "./lib/write-generated-projects.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const landscapeRoot = path.join(root, "imgs", "Exterior", "landscape");
const detailsFile = path.join(root, "lib", "exterior-landscape-details.ts");
const outFile = path.join(root, "lib", "exterior-landscape-projects.ts");
const loadersFile = path.join(root, "lib", "exterior-landscape-gallery-loaders.ts");

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
  return `lsc-${base}`;
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
  return `ls${folderIndex}_img${fileIndex}`;
}

function posix(p) {
  return p.split(path.sep).join("/");
}

const detailsByOrder = loadDetailsByOrder();

const folders = fs
  .readdirSync(landscapeRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (folders.length !== 7) {
  console.warn(`Expected 7 landscape folders, found ${folders.length}.`);
}

const importLines = [];
const coverImportLines = [];
const projectBlocks = [];
const galleryEntries = [];

folders.forEach((folder, folderIndex) => {
  const dir = path.join(landscapeRoot, folder);
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
    const rel = posix(path.join("imgs", "Exterior", "landscape", folder, file));
    const line = `import ${v} from "@/${rel}";`;
    importLines.push(line);
    projectImportLines.push(line);
    if (fileIndex === 0) coverImportLines.push(line);
    return v;
  });

  const slug = folderToSlug(folder);
  const orderLabel = String(folderIndex + 1).padStart(2, "0");
  const details = detailsByOrder[orderLabel];
  const title = details?.name || orderLabel;
  const location = details?.location || "Palestine";
  const tag = details?.projectType || "Landscape Design";
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
    tag: ${JSON.stringify(tag)},
    category: "Residential" as const,
    serviceSlug: "exterior" as const,
    exteriorType: "landscape" as const,
${optionalFields.join("\n")}
    image: ${coverVar},
    imageAlt: ${JSON.stringify(`${title} — design visualization`)},
  },`);

  galleryEntries.push({
    id: slug,
    importLines: projectImportLines,
    varNames: vars,
  });
});

writeGeneratedProjectModules({
  banner: "scripts/generate-landscape-projects.mjs",
  projectsFile: outFile,
  loadersFile,
  loadersExportName: "landscapeGalleryLoaders",
  coverImportLines,
  projectsConstName: "landscapeProjects",
  projectBlocks,
  galleryEntries,
});
console.log(`Wrote ${outFile} + ${loadersFile} (${folders.length} projects, ${coverImportLines.length} covers, ${importLines.length} images).`);
console.log(
  `Titles: ${folders
    .map((_, i) => detailsByOrder[String(i + 1).padStart(2, "0")]?.name || "?")
    .join(" | ")}`,
);
