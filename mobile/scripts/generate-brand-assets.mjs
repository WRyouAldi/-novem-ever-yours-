import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const brand = resolve(root, "assets/brand");
const out = resolve(root, "assets/generated");
await mkdir(out, { recursive: true });
const monogram = await readFile(resolve(brand, "monogram.svg"));
const wordmark = await readFile(resolve(brand, "wordmark.svg"));

await sharp(monogram).resize(1024, 1024).png().toFile(resolve(out, "icon.png"));
await sharp(monogram).resize(1024, 1024).png().toFile(resolve(out, "adaptive-icon.png"));

const splash = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1800" viewBox="0 0 1200 1800">
<rect width="1200" height="1800" fill="#F7F0EA"/>
<circle cx="600" cy="735" r="360" fill="none" stroke="#D9C9C2" stroke-width="2"/>
<image href="data:image/svg+xml;base64,${wordmark.toString("base64")}" x="120" y="1040" width="960" height="336"/>
<text x="600" y="1510" text-anchor="middle" fill="#8794A3" font-family="Georgia,serif" font-style="italic" font-size="30">From Happy 27 to our 1st Anniversary</text>
<text x="600" y="1570" text-anchor="middle" fill="#A65A68" font-family="Georgia,serif" font-size="34">♡</text>
</svg>`);
await sharp(monogram).resize(520, 520).png().toBuffer().then(async (mark) => {
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1800"><rect width="1200" height="1800" fill="#F7F0EA"/><image href="data:image/png;base64,${mark.toString("base64")}" x="340" y="370" width="520" height="520"/><image href="data:image/svg+xml;base64,${wordmark.toString("base64")}" x="100" y="1000" width="1000" height="350"/><text x="600" y="1490" text-anchor="middle" fill="#8794A3" font-family="Georgia,serif" font-size="28" font-style="italic">From Happy 27 to our 1st Anniversary</text></svg>`);
  await sharp(svg).png().toFile(resolve(out, "splash.png"));
});
console.log("Generated icon.png, adaptive-icon.png and splash.png");
