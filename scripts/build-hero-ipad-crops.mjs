/**
 * Lossless PNG crops from approved public hero masters for iPad (768–1279px).
 * Full source height preserved; horizontal window art-directed per slide.
 */
import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const HERO_DIR = path.join(process.cwd(), "public", "hero");

/** Premium focal points on the ultra-wide still (0–1). */
const SLIDES = [
  { src: "hero-lcp.png", out: "hero-lcp-ipad.png", focusX: 0.4, cropW: 1080 },
  { src: "hero-slide-2.png", out: "hero-slide-2-ipad.png", focusX: 0.48, cropW: 1120 },
  { src: "hero-slide-3.png", out: "hero-slide-3-ipad.png", focusX: 0.53, cropW: 1100 },
  { src: "hero-slide-4.png", out: "hero-slide-4-ipad.png", focusX: 0.47, cropW: 1060 },
];

function clampLeft(srcW, cropW, focusX) {
  const maxLeft = Math.max(0, srcW - cropW);
  const ideal = Math.round(srcW * focusX - cropW / 2);
  return Math.min(maxLeft, Math.max(0, ideal));
}

for (const slide of SLIDES) {
  const inputPath = path.join(HERO_DIR, slide.src);
  if (!existsSync(inputPath)) {
    throw new Error(`Missing master: ${inputPath}`);
  }

  const meta = await sharp(inputPath).metadata();
  const srcW = meta.width ?? 0;
  const srcH = meta.height ?? 0;
  const cropW = Math.min(slide.cropW, srcW);
  const cropH = srcH;
  const left = clampLeft(srcW, cropW, slide.focusX);

  const buffer = await sharp(inputPath)
    .removeAlpha()
    .extract({ left, top: 0, width: cropW, height: cropH })
    .png({ compressionLevel: 1, adaptiveFiltering: false })
    .toBuffer();

  writeFileSync(path.join(HERO_DIR, slide.out), buffer);
  console.log(`${slide.out} ${cropW}x${cropH} left=${left} (${Math.round(buffer.byteLength / 1024)}kb)`);
}