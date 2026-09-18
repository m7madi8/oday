/**
 * Rebuild homepage hero stills from the high-resolution 16:9 masters.
 *
 * The live slides were previously 672px tall ultrawides, which pixelate on
 * any retina full-viewport hero. This script writes 4K (`*-4k.jpg`) files
 * that `lib/hero-content.ts` imports.
 *
 * After regenerating the 4K masters, run `npm run hero:crops` so phone and
 * iPad portrait stills stay aligned with the new frames.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const HERO_DIR = path.join(process.cwd(), "imgs", "hero");
const JPEG = {
  quality: 95,
  mozjpeg: true,
  chromaSubsampling: "4:4:4",
  trellisQuantisation: true,
  overshootDeringing: true,
  optimizeScans: true,
};

function inpaintRight(data, width, height, channels, rect, dx) {
  const original = Buffer.from(data);
  const x0 = Math.round(rect.x0 * width);
  const y0 = Math.round(rect.y0 * height);
  const x1 = Math.round(rect.x1 * width);
  const y1 = Math.round(rect.y1 * height);
  const shift = Math.round(dx * width);

  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const sx = Math.min(width - 1, x + shift);
      const si = (y * width + sx) * channels;
      const di = (y * width + x) * channels;
      data[di] = original[si];
      data[di + 1] = original[si + 1];
      data[di + 2] = original[si + 2];
    }
  }

  const featherY = Math.round(height * 0.01);
  const featherX = Math.round(width * 0.01);

  for (let y = y0; y < Math.min(y1, y0 + featherY); y += 1) {
    const keep = (y - y0) / featherY;
    for (let x = x0; x < x1; x += 1) {
      const di = (y * width + x) * channels;
      data[di] = Math.round(data[di] * keep + original[di] * (1 - keep));
      data[di + 1] = Math.round(data[di + 1] * keep + original[di + 1] * (1 - keep));
      data[di + 2] = Math.round(data[di + 2] * keep + original[di + 2] * (1 - keep));
    }
  }

  for (let y = y0; y < y1; y += 1) {
    for (let x = Math.max(x0, x1 - featherX); x < x1; x += 1) {
      const t = (x1 - x) / featherX;
      const di = (y * width + x) * channels;
      data[di] = Math.round(data[di] * t + original[di] * (1 - t));
      data[di + 1] = Math.round(data[di + 1] * t + original[di + 1] * (1 - t));
      data[di + 2] = Math.round(data[di + 2] * t + original[di + 2] * (1 - t));
    }
  }

  return data;
}

async function writeJpeg(pipeline, outFile) {
  const buffer = await pipeline.jpeg(JPEG).toBuffer();
  writeFileSync(path.join(HERO_DIR, outFile), buffer);
  const meta = await sharp(buffer).metadata();
  console.log(`wrote ${outFile} ${meta.width}x${meta.height} ${Math.round(buffer.byteLength / 1024)}kb`);
}

async function copyMaster(srcFile, outFile) {
  await writeJpeg(sharp(path.join(HERO_DIR, srcFile)).removeAlpha(), outFile);
}

async function stripAndWrite(srcFile, outFile, rect, dx) {
  const { data, info } = await sharp(path.join(HERO_DIR, srcFile))
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  inpaintRight(data, info.width, info.height, info.channels, rect, dx);
  await writeJpeg(
    sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } }),
    outFile,
  );
}

async function rebuildWideFromMaster({ wideFile, hiFile, outFile, stripHi, targetHeight }) {
  const wideBuffer = readFileSync(path.join(HERO_DIR, wideFile));
  const hiPath = path.join(HERO_DIR, hiFile);
  const wideMeta = await sharp(wideBuffer).metadata();

  let hiPacked;
  if (stripHi) {
    const { data, info } = await sharp(hiPath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    inpaintRight(data, info.width, info.height, info.channels, { x0: 0, y0: 0.855, x1: 0.185, y1: 1 }, 0.16);
    hiPacked = await sharp(data, {
      raw: { width: info.width, height: info.height, channels: info.channels },
    })
      .jpeg(JPEG)
      .toBuffer({ resolveWithObject: true });
  } else {
    hiPacked = await sharp(hiPath).jpeg(JPEG).toBuffer({ resolveWithObject: true });
  }

  const hiMeta = await sharp(hiPacked.data).metadata();
  const nativeScale = hiMeta.height / wideMeta.height;
  const nativeW = Math.round(wideMeta.width * nativeScale);
  const nativeH = hiMeta.height;
  const origWAtWide = wideMeta.height * (hiMeta.width / hiMeta.height);
  const leftNative = Math.round(((wideMeta.width - origWAtWide) / 2) * nativeScale);

  let composed = sharp(
    await sharp(wideBuffer).resize(nativeW, nativeH, { fit: "fill", kernel: "lanczos3" }).toBuffer(),
  ).composite([{ input: hiPacked.data, left: Math.max(0, leftNative), top: 0 }]);

  if (targetHeight && targetHeight > nativeH) {
    const targetW = Math.round(nativeW * (targetHeight / nativeH));
    composed = sharp(await composed.jpeg(JPEG).toBuffer())
      .resize(targetW, targetHeight, { fit: "fill", kernel: "lanczos3" })
      .sharpen({ sigma: 0.7, m1: 0.6, m2: 2.2 });
  }

  await writeJpeg(composed, outFile);
}

await copyMaster("villa-hero.jpg", "villa-marble-frontal-4k.jpg");

await stripAndWrite(
  "villa-marble.jpg",
  "villa-black-marble-4k.jpg",
  { x0: 0, y0: 0.868, x1: 0.145, y1: 1 },
  0.16,
);

await rebuildWideFromMaster({
  wideFile: "villa-stone-facade.jpg",
  hiFile: "villa-facade.jpg",
  outFile: "villa-stone-facade-4k.jpg",
  stripHi: true,
  targetHeight: 2304,
});

await writeJpeg(
  sharp(path.join(HERO_DIR, "villa-entrance-evening.jpg"))
    .removeAlpha()
    .resize(4096, 2304, { fit: "fill", kernel: "lanczos3" })
    .sharpen({ sigma: 0.7, m1: 0.6, m2: 2.2 }),
  "villa-entrance-evening-4k.jpg",
);
