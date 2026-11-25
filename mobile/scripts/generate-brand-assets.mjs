import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const brand = resolve(root, "assets/brand");
const out = resolve(root, "assets/generated");
await mkdir(out, { recursive: true });

const monogramSvg = await readFile(resolve(brand, "monogram.svg"));
const wordmarkSvg = await readFile(resolve(brand, "wordmark.svg"));
const icon = await sharp(monogramSvg).resize(1024, 1024).png().toBuffer();
const logo = await sharp(wordmarkSvg).png().toBuffer();
const tagline = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="120"><text x="600" y="68" text-anchor="middle" fill="#8794A3" font-family="Georgia,serif" font-style="italic" font-size="32">From Happy 27 to our 1st Anniversary</text></svg>`);
const brandVisual = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#F7F0EA"/><circle cx="600" cy="315" r="260" fill="none" stroke="#D9C9C2" stroke-width="2"/><path d="M80 90H1120M80 540H1120" stroke="#8794A3" stroke-width="1" opacity=".55"/></svg>`);

await sharp(monogramSvg).resize(1024, 1024).png().toFile(resolve(out, "icon.png"));
await sharp(monogramSvg).resize(1024, 1024).png().toFile(resolve(out, "adaptive-icon.png"));
await sharp({ create: { width: 1200, height: 1800, channels: 4, background: "#F7F0EA" } })
  .composite([
    { input: icon, left: 88, top: 330, width: 1024, height: 1024 },
    { input: logo, left: 0, top: 1120, width: 1200, height: 420 },
    { input: tagline, left: 0, top: 1510 }
  ])
  .png().toFile(resolve(out, "splash.png"));
await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#F7F0EA" } })
  .composite([
    { input: brandVisual, left: 0, top: 0 },
    { input: icon, left: 360, top: 35, width: 480, height: 480 },
    { input: logo, left: 180, top: 440, width: 840, height: 294 }
  ])
  .png().toFile(resolve(out, "brand-visual.png"));
await sharp(wordmarkSvg).png().toFile(resolve(out, "logo.png"));
console.log("Generated icon, adaptive icon, splash, logo and brand visual assets.");
