import sharp from "sharp";

const source = process.argv[2];
const output = process.argv[3];

if (!source || !output) {
  console.error("Usage: node scripts/remove-hero-logo.mjs <input> <output>");
  process.exit(1);
}

const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: w, height: h, channels: c } = info;

const x0 = 0;
const y0 = Math.round(h * 0.855);
const x1 = Math.round(w * 0.185);
const y1 = h;
const srcX = Math.round(w * 0.24);
const srcSpan = Math.round(w * 0.14);

const original = Buffer.from(data);

for (let y = y0; y < y1; y += 1) {
  for (let x = x0; x < x1; x += 1) {
    const sx = srcX + ((x - x0) % srcSpan);
    const sy = Math.min(h - 1, Math.max(y0, y + ((x + y) % 3) - 1));
    const si = (sy * w + sx) * c;
    const di = (y * w + x) * c;
    data[di] = original[si];
    data[di + 1] = original[si + 1];
    data[di + 2] = original[si + 2];
  }
}

// Feather the top edge back into the original pavement.
const blendRows = 22;
for (let y = y0; y < y0 + blendRows; y += 1) {
  const keep = (y - y0) / blendRows;
  for (let x = x0; x < x1; x += 1) {
    const di = (y * w + x) * c;
    const oi = di;
    data[di] = Math.round(data[di] * keep + original[oi] * (1 - keep));
    data[di + 1] = Math.round(data[di + 1] * keep + original[oi + 1] * (1 - keep));
    data[di + 2] = Math.round(data[di + 2] * keep + original[oi + 2] * (1 - keep));
  }
}

await sharp(data, { raw: { width: w, height: h, channels: c } })
  .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: "4:4:4" })
  .toFile(output);

console.log(`Saved ${output} (${w}x${h}), logo region ${x1}x${y1 - y0}px`);
