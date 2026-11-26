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
const splashMark = await sharp(icon).resize(720, 720).png().toBuffer();
const splashWordmark = await sharp(logo).resize(960, 336).png().toBuffer();
const visualMark = await sharp(icon).resize(320, 320).png().toBuffer();
const visualWordmark = await sharp(logo).resize(900, 315).png().toBuffer();
const tagline = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="120"><text x="600" y="68" text-anchor="middle" fill="#8794A3" font-family="Georgia,serif" font-style="italic" font-size="32">D 27  •  DAISY EDITION</text></svg>`);
const brandVisual = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720"><rect width="1200" height="720" fill="#F7F0EA"/><circle cx="600" cy="360" r="290" fill="none" stroke="#D9C9C2" stroke-width="2"/><path d="M80 90H1120M80 630H1120" stroke="#8794A3" stroke-width="1" opacity=".55"/></svg>`);

await sharp(icon).png().toFile(resolve(out, "icon.png"));
await sharp(icon).png().toFile(resolve(out, "adaptive-icon.png"));
await sharp({ create: { width: 1200, height: 1800, channels: 4, background: "#F7F0EA" } })
  .composite([
    { input: splashMark, left: 240, top: 300 },
    { input: splashWordmark, left: 120, top: 1120 },
    { input: tagline, left: 0, top: 1510 }
  ])
  .png().toFile(resolve(out, "splash.png"));
await sharp(brandVisual)
  .composite([
    { input: visualMark, left: 440, top: 20 },
    { input: visualWordmark, left: 150, top: 350 }
  ])
  .png().toFile(resolve(out, "brand-visual.png"));
await sharp(logo).png().toFile(resolve(out, "logo.png"));
console.log("Generated icon, adaptive icon, splash, logo and brand visual assets.");
