import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const baseURL = "http://127.0.0.1:4173"; // local Vite production preview
const output = "artifacts";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];


// Exercise real scroll reveals before capturing the full-page previews.
async function revealEverySection(page) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewportHeight = page.viewportSize().height;
  for (let y = 0; y < total; y += Math.max(360, Math.floor(viewportHeight * 0.72))) {
    await page.evaluate(position => window.scrollTo(0, position), y);
    await page.waitForTimeout(180);
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(950);
  const report = await page.locator(".section-heading, .timeline-item, .video-card, .photo-tile").evaluateAll(nodes => nodes.map(node => ({
    element: node.className || node.tagName.toLowerCase(),
    opacity: Number(getComputedStyle(node).opacity),
    rect: node.getBoundingClientRect().height
  })));
  const hidden = report.filter(item => item.rect > 0 && item.opacity < 0.95);
  if (hidden.length) throw new Error("Scroll reveal elements remain hidden: " + JSON.stringify(hidden.slice(0, 8)));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
}

async function audit(name, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    document.querySelectorAll("img").forEach(img => { img.loading = "eager"; });
    await Promise.all([...document.images].map(img => img.decode().catch(() => null)));
  });
  await page.waitForTimeout(900);
  const metrics = await page.evaluate(() => ({
    width: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.getAttribute("src")),
    videoCount: document.querySelectorAll("video").length,
    posterCount: [...document.querySelectorAll("video")].filter(v => v.poster).length,
    galleryCount: document.querySelectorAll(".photo-tile").length
  }));
  if (metrics.documentWidth > metrics.width) errors.push("Horizontal overflow: " + metrics.documentWidth + "px > " + metrics.width + "px");
  if (metrics.brokenImages.length) errors.push("Broken images: " + metrics.brokenImages.join(", "));
  if (metrics.videoCount !== 12 || metrics.posterCount !== 12) errors.push("Expected 12 video elements and posters.");
  if (metrics.galleryCount !== 6) errors.push("Expected six-photo initial gallery preview.");
  await revealEverySection(page);

  if (name === "mobile") {
    await page.locator(".menu-toggle").waitFor({ state: "visible" });
    await page.locator(".menu-toggle").click();
    if (!(await page.getByRole("navigation", { name: "Navigasi utama" }).isVisible())) errors.push("Mobile navigation did not open.");
  }
  await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
  results.push({ name, viewport, metrics, errors });
  await page.close();
}

try {
  await audit("desktop", { width: 1440, height: 1000 });
  await audit("mobile", { width: 390, height: 844 });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /View More Photos/ }).click();
  const expanded = await page.locator(".photo-tile").count();
  if (expanded !== 21) throw new Error(`Gallery expansion expected 21 photos, found ${expanded}.`);
  await page.locator(".photo-tile").first().click();
  if (!(await page.locator(".lightbox-panel").isVisible())) throw new Error("Photo lightbox did not open.");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  if (await page.locator(".lightbox-panel").isVisible()) throw new Error("Photo lightbox did not close with Escape.");
  results.push({ name: "interactions", expandedGallery: expanded, lightbox: "open/close passed", errors: [] });
  await page.close();
} finally {
  await browser.close();
}
console.log(JSON.stringify(results, null, 2));
if (results.some(result => result.errors.length)) process.exit(1);
