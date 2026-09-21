import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = process.argv[2] ?? "imgs/IMG-20260921-WA0000.jpg";
const output = process.argv[3] ?? "imgs/oday-signature.png";

const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({
  resolveWithObject: true,
});

const { width, height, channels } = info;

for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  let ink = 1 - lum / 255;
  ink = Math.max(0, (ink - 0.07) / 0.93);
  ink = Math.pow(ink, 0.82);
  data[i] = 255;
  data[i + 1] = 255;
  data[i + 2] = 255;
  data[i + 3] = Math.round(Math.min(255, ink * 255));
}

let minX = width;
let minY = height;
let maxX = 0;
let maxY = 0;

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const alpha = data[(y * width + x) * channels + 3];
    if (alpha > 10) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
}

const pad = 10;
const left = Math.max(0, minX - pad);
const top = Math.max(0, minY - pad);
const cropWidth = Math.min(width - left, maxX - minX + 1 + pad * 2);
const cropHeight = Math.min(height - top, maxY - minY + 1 + pad * 2);

await mkdir(path.dirname(output), { recursive: true });

await sharp(data, { raw: { width, height, channels } })
  .extract({ left, top, width: cropWidth, height: cropHeight })
  .png({ compressionLevel: 9 })
  .toFile(output);

console.log(`Saved ${output} (${cropWidth}x${cropHeight})`);
