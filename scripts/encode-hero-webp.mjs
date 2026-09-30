/**
 * Lossless-ish WebP masters for hero stills (smaller disk + faster Next image pipeline).
 * Run: npm run hero:webp
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const HERO_DIR = path.join(ROOT, "imgs", "hero");

const FILES = [
  "villa-marble-frontal-ultrawide-4k.jpg",
  "villa-marble-frontal-mobile.jpg",
  "villa-marble-frontal-tablet.jpg",
  "villa-black-marble-ultrawide-4k.jpg",
  "villa-black-marble-mobile.jpg",
  "villa-black-marble-tablet.jpg",
  "villa-entrance-evening-4k.jpg",
  "villa-entrance-evening-mobile.jpg",
  "villa-entrance-evening-tablet.jpg",
  "villa-stone-facade-ultrawide-4k.jpg",
  "villa-stone-facade-mobile.jpg",
  "villa-stone-facade-tablet.jpg",
];

async function encodeOne(name) {
  const input = path.join(HERO_DIR, name);
  if (!fs.existsSync(input)) {
    console.warn("skip (missing):", name);
    return;
  }
  const output = path.join(HERO_DIR, name.replace(/\.jpe?g$/i, ".webp"));
  await sharp(input)
    .webp({ quality: 92, effort: 4, smartSubsample: true })
    .toFile(output);
  const inKb = Math.round(fs.statSync(input).size / 1024);
  const outKb = Math.round(fs.statSync(output).size / 1024);
  console.log(`${name} → ${path.basename(output)} (${inKb}KB → ${outKb}KB)`);
}

async function main() {
  for (const file of FILES) {
    await encodeOne(file);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
