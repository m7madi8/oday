/**
 * Generates lib/interior-projects.ts from imgs/Interior/* folders.
 * Run: node scripts/generate-interior-projects.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeGeneratedProjectModules } from "./lib/write-generated-projects.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const interiorRoot = path.join(root, "imgs", "Interior");
const detailsFile = path.join(root, "lib", "interior-details.ts");
const outFile = path.join(root, "lib", "interior-projects.ts");
const loadersFile = path.join(root, "lib", "interior-gallery-loaders.ts");

const IMAGE_EXT = /\.(webp|jpe?g|png)$/i;

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
  return `in-${base}`;
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
  return `in${folderIndex}_img${fileIndex}`;
}

function posix(p) {
  return p.split(path.sep).join("/");
}

const detailsByOrder = loadDetailsByOrder();

const folders = fs
  .readdirSync(interiorRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (folders.length !== 37) {
  console.warn(`Expected 37 interior folders, found ${folders.length}.`);
}

const importLines = [];
const coverImportLines = [];
const projectBlocks = [];
const galleryEntries = [];

folders.forEach((folder, folderIndex) => {
  const dir = path.join(interiorRoot, folder);
  const files = fs
    .readdirSync(dir)
    .filter((f) => IMAGE_EXT.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const useFallback = files.length === 0;
  if (useFallback) {
    console.warn(`Empty folder (placeholder cover): ${folder}`);
  }

  const coverName = useFallback ? null : pickCover(files);
  const galleryNames = useFallback ? [] : sortGallery(files, coverName);
  const ordered = useFallback ? [] : [coverName, ...galleryNames];

  const projectImportLines = [];
  const vars = useFallback
    ? ["interiorFallback"]
    : ordered.map((file, fileIndex) => {
        const v = importVar(folderIndex, fileIndex);
        const rel = posix(path.join("imgs", "Interior", folder, file));
        const line = `import ${v} from "@/${rel}";`;
        importLines.push(line);
        projectImportLines.push(line);
        if (fileIndex === 0) coverImportLines.push(line);
        return v;
      });
  if (useFallback) {
    projectImportLines.push(`import interiorFallback from "@/imgs/interior.jpg";`);
  }

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
    tag: "Interior Design",
    category: "Residential" as const,
    serviceSlug: "interior" as const,
${optionalFields.join("\n")}
    image: ${coverVar},
    imageAlt: ${JSON.stringify(`${title} — interior visualization`)},
  },`);

  galleryEntries.push({
    id: slug,
    importLines: projectImportLines,
    varNames: vars,
  });
});

const needsFallback = folders.some((folder) => {
  const dir = path.join(interiorRoot, folder);
  return fs.readdirSync(dir).filter((f) => IMAGE_EXT.test(f)).length === 0;
});

const fallbackImport = needsFallback
  ? `import interiorFallback from "@/imgs/interior.jpg";\n`
  : "";

writeGeneratedProjectModules({
  banner: "scripts/generate-interior-projects.mjs",
  projectsFile: outFile,
  loadersFile,
  loadersExportName: "interiorGalleryLoaders",
  extraImports: fallbackImport,
  coverImportLines,
  projectsConstName: "interiorProjects",
  projectBlocks,
  galleryEntries,
});
console.log(`Wrote ${outFile} + ${loadersFile} (${folders.length} projects, ${coverImportLines.length} covers, ${importLines.length} images).`);
console.log(
  `Details matched: ${folders.filter((_, i) => detailsByOrder[String(i + 1).padStart(2, "0")]).length}/${folders.length}`,
);
