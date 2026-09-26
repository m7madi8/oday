/**
 * Build homepage hero stills from imgs/heroo masters.
 *
 * The heroo frames are authentic 21:9 compositions (1584×672). We upscale them
 * with integer Lanczos only — same framing, no sharpen, no recomposition.
 * Default scale: 8× source height (672 → 5376px).
 */
import { readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const HEROO_DIR = path.join(process.cwd(), "imgs", "heroo");
const HERO_DIR = path.join(process.cwd(), "imgs", "hero");
/** Integer upscale from 672px-tall heroo masters (8× → 5376px height). */
const TARGET_HEIGHT = 5376;
const JPEG = {
  quality: 100,
  mozjpeg: true,
  chromaSubsampling: "4:4:4",
  trellisQuantisation: true,
  overshootDeringing: true,
  optimizeScans: true,
};

/** ~iPhone 14/15/16 Pro portrait. Full master height, sides cropped. */
const MOBILE_ASPECT = 9 / 19.5;
/** iPad portrait (3:4). Full master height, sides cropped. */
const TABLET_ASPECT = 3 / 4;

const SLIDES = [
  {
    match: /(^|[^\d])1([^\d]|$)/,
    prefer: "هيرو 1",
    stem: "villa-marble-frontal",
    focusX: 0.5,
    focusXMobile: 0.48,
  },
  {
    match: /(^|[^\d])2([^\d]|$)/,
    prefer: "هيرو2",
    stem: "villa-black-marble",
    focusX: 0.5,
    focusXMobile: 0.46,
  },
  {
    match: /(^|[^\d])3([^\d]|$)/,
    prefer: "هيرو3",
    stem: "villa-entrance-evening",
    focusX: 0.52,
    focusXMobile: 0.54,
  },
  {
    match: /(^|[^\d])4([^\d]|$)/,
    prefer: "هيرو 4",
    stem: "villa-stone-facade",
    focusX: 0.5,
    focusXMobile: 0.5,
  },
];

function cropBox(width, height, aspect, focusX) {
  const cropW = Math.min(width, Math.round(height * aspect));
  const cropH = height;
  const maxLeft = width - cropW;
  const left = Math.round(Math.min(maxLeft, Math.max(0, width * focusX - cropW / 2)));
  return { left, top: 0, width: cropW, height: cropH };
}

function findSource(files, slide) {
  const preferred = files.find((name) => name.includes(slide.prefer));
  if (preferred) return preferred;
  const matched = files.filter((name) => slide.match.test(name));
  if (matched.length === 1) return matched[0];
  throw new Error(`Could not resolve heroo source for ${slide.stem}. Files: ${files.join(", ")}`);
}

async function writeJpeg(pipeline, outFile) {
  const buffer = await pipeline.jpeg(JPEG).toBuffer();
  writeFileSync(path.join(HERO_DIR, outFile), buffer);
  const meta = await sharp(buffer).metadata();
  console.log(`wrote ${outFile} ${meta.width}x${meta.height} ${Math.round(buffer.byteLength / 1024)}kb`);
  return meta;
}

const files = readdirSync(HEROO_DIR).filter((name) => /\.(jpe?g|png|webp)$/i.test(name));
console.log(`heroo sources: ${files.join(" | ")}`);

for (const slide of SLIDES) {
  const srcName = findSource(files, slide);
  const srcPath = path.join(HEROO_DIR, srcName);
  const srcMeta = await sharp(srcPath).metadata();
  const scale = TARGET_HEIGHT / srcMeta.height;
  if (!Number.isInteger(scale)) {
    throw new Error(
      `${srcName}: TARGET_HEIGHT ${TARGET_HEIGHT} must be an integer multiple of source height ${srcMeta.height}`,
    );
  }
  const targetWidth = srcMeta.width * scale;

  console.log(
    `\n${slide.stem} ← ${srcName} ${srcMeta.width}x${srcMeta.height} → ${targetWidth}x${TARGET_HEIGHT} (${scale}×)`,
  );

  const masterFile =
    slide.stem === "villa-entrance-evening"
      ? `${slide.stem}-4k.jpg`
      : `${slide.stem}-ultrawide-4k.jpg`;

  await writeJpeg(
    sharp(srcPath)
      .removeAlpha()
      .resize(targetWidth, TARGET_HEIGHT, { fit: "fill", kernel: "lanczos3" }),
    masterFile,
  );

  const masterPath = path.join(HERO_DIR, masterFile);
  const masterMeta = await sharp(masterPath).metadata();

  for (const [suffix, aspect, focus] of [
    ["mobile", MOBILE_ASPECT, slide.focusXMobile],
    ["tablet", TABLET_ASPECT, slide.focusX],
  ]) {
    const region = cropBox(masterMeta.width, masterMeta.height, aspect, focus);
    await writeJpeg(
      sharp(masterPath).removeAlpha().extract(region),
      `${slide.stem}-${suffix}.jpg`,
    );
  }
}

console.log("\nDone. Masters are pure integer upscales; portrait crops keep full height, sides only.");
