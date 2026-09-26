/**
 * Portrait crops of the 4K hero stills for phones and iPads.
 *
 * Homepage hero is 100dvh with object-fit: cover by HEIGHT. Landscape 21:9
 * stills covered onto a portrait screen keep sky and ground; only the sides
 * crop. next/image with sizes="100vw" fetches by WIDTH — so a 3x iPhone would
 * otherwise get a ~1200px landscape file and upscale it 3–4×. These crops keep
 * the native 4K height so a width-based srcset still has enough vertical pixels.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const HERO_DIR = path.join(process.cwd(), "imgs", "hero");
const JPEG = {
  quality: 100,
  mozjpeg: true,
  chromaSubsampling: "4:4:4",
  trellisQuantisation: true,
  overshootDeringing: true,
  optimizeScans: true,
};

const MASTERS = [
  {
    src: "villa-marble-frontal-ultrawide-4k.jpg",
    stem: "villa-marble-frontal",
    focusX: 0.5,
    focusXMobile: 0.48,
  },
  { src: "villa-black-marble-ultrawide-4k.jpg", stem: "villa-black-marble", focusX: 0.5, focusXMobile: 0.46 },
  { src: "villa-entrance-evening-4k.jpg", stem: "villa-entrance-evening", focusX: 0.52, focusXMobile: 0.54 },
  { src: "villa-stone-facade-ultrawide-4k.jpg", stem: "villa-stone-facade", focusX: 0.5 },
];

/** ~iPhone 14/15/16 Pro portrait. Slightly taller than 9:16 so 100vw still has height. */
const MOBILE_ASPECT = 9 / 19.5;
/** iPad portrait (1024×1366 is exactly 3:4). */
const TABLET_ASPECT = 3 / 4;

function cropBox(width, height, aspect, focusX) {
  const cropW = Math.min(width, Math.round(height * aspect));
  const cropH = height;
  const maxLeft = width - cropW;
  const left = Math.round(Math.min(maxLeft, Math.max(0, width * focusX - cropW / 2)));
  return { left, top: 0, width: cropW, height: cropH };
}

async function writeCrop(srcFile, outFile, aspect, focusX) {
  const input = sharp(path.join(HERO_DIR, srcFile)).removeAlpha();
  const meta = await input.metadata();
  const region = cropBox(meta.width, meta.height, aspect, focusX);
  const buffer = await input.extract(region).jpeg(JPEG).toBuffer();
  writeFileSync(path.join(HERO_DIR, outFile), buffer);
  console.log(`wrote ${outFile} ${region.width}x${region.height} ${Math.round(buffer.byteLength / 1024)}kb`);
}

for (const slide of MASTERS) {
  await writeCrop(
    slide.src,
    `${slide.stem}-mobile.jpg`,
    MOBILE_ASPECT,
    slide.focusXMobile ?? slide.focusX,
  );
  await writeCrop(slide.src, `${slide.stem}-tablet.jpg`, TABLET_ASPECT, slide.focusX);
}
