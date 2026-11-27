import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const baseURL = "http://127.0.0.1:4173";
const output = "artifacts";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];

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

async function auditSurprise(page, name) {
  const launcherCount = await page.locator(".surprise-launch").count();
  if (launcherCount !== 0) throw new Error("Legacy Unlock a little surprise launcher is still present.");
  const dialog = page.locator(".surprise-panel");
  await dialog.waitFor({ state: "visible", timeout: 5000 });
  const assertDescription = async expected => {
    const id = await dialog.getAttribute("aria-describedby");
    if (id !== expected || !(await page.locator("#" + id).count())) {
      throw new Error(`Surprise dialog has a missing or stale description in phase ${expected}.`);
    }
  };
  await assertDescription("surprise-description");

  const wrongNumber = (await dialog.locator(".secret-number-grid button").allTextContents()).map(value => value.trim()).find(value => value !== "27");
  await dialog.getByRole("button", { name: wrongNumber, exact: true }).click();
  if (!(await dialog.getByText("Belum tepat, sayang. Coba pilih lagi", { exact: false }).isVisible())) {
    throw new Error("Wrong secret number did not show retry feedback.");
  }
  for (const number of [27, 11, 25]) {
    await dialog.getByRole("button", { name: String(number), exact: true }).click();
  }
  const daisy = dialog.getByRole("img", { name: "Bunga daisy mekar" });
  await daisy.waitFor({ state: "visible" });
  if (await dialog.locator(".daisy-float-petal").count() !== 6) throw new Error("Daisy bloom is missing its six floating petals.");
  await assertDescription("daisy-description");
  await dialog.getByRole("button", { name: /Buka kartu anniversary/ }).click();
  await dialog.getByText("Happy 1st", { exact: false }).waitFor({ state: "visible" });
  await assertDescription("card-description");
  await dialog.getByRole("button", { name: /Read our letter/ }).click();
  const letter = page.locator(".letter-dialog-panel");
  await letter.waitFor({ state: "visible" });
  await letter.getByRole("button", { name: "Tutup surat" }).click();
  await letter.waitFor({ state: "hidden" });
  // Read our letter intentionally dismisses the surprise dialog before opening the letter.
  await dialog.waitFor({ state: "hidden" });
  await page.waitForTimeout(2200);
  if (await dialog.isVisible()) throw new Error("Surprise popup reopened after dismissal during the same visit.");
  return { viewport: name, autoPopup: "visible", delay: "2 seconds configured", legacyLauncher: "removed", secretChallenge: "pass", daisyAndCard: "pass", letterHandoff: "pass", dismissal: "stays dismissed" };
}

async function auditReducedMotion() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(baseURL, { waitUntil: "networkidle" });
  const dialog = page.locator(".surprise-panel");
  await dialog.waitFor({ state: "visible", timeout: 5000 });
  for (const number of [27, 11, 25]) await dialog.getByRole("button", { name: String(number), exact: true }).click();
  await dialog.getByRole("img", { name: "Bunga daisy mekar" }).waitFor({ state: "visible" });
  const motion = await dialog.locator(".daisy-petal").first().evaluate(node => ({
    animationName: getComputedStyle(node).animationName,
    floatingPetals: getComputedStyle(node.closest(".surprise-panel").querySelector(".daisy-float-petal")).display
  }));
  if (motion.animationName !== "none" || motion.floatingPetals !== "none") throw new Error("Reduced-motion preference did not disable Daisy animations.");
  await page.close();
}

async function audit(name, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  // Start the timing assertion at DOMContentLoaded, not after networkidle:
  // waiting for network idle can itself exceed the popup's 2-second delay.
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  const dialog = page.locator(".surprise-panel");
  await page.locator("main").waitFor({ state: "attached" });
  if (await dialog.count() && await dialog.isVisible()) errors.push("Surprise popup was visible immediately after initial DOM load.");
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
  if (metrics.videoCount !== 11 || metrics.posterCount !== 11) errors.push("Expected 11 video elements and posters.");
  if (metrics.galleryCount !== 6) errors.push("Expected six-photo initial gallery preview.");
  // Verify that the initially hidden dialog becomes visible after its 2-second timer.
  await dialog.waitFor({ state: "visible", timeout: 5000 });
  await dialog.getByRole("button", { name: "Tutup kejutan" }).click();
  await dialog.waitFor({ state: "hidden" });
  await revealEverySection(page);
  await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
  await page.waitForTimeout(2200);
  await dialog.waitFor({ state: "hidden" });
  // Reload to run the complete first-visit challenge flow from its initial state.
  await page.reload({ waitUntil: "networkidle" });
  const surprise = await auditSurprise(page, name);
  if (name === "mobile") {
    const menuButton = page.locator(".menu-toggle");
    await menuButton.waitFor({ state: "visible" });
    const nav = page.getByRole("navigation", { name: "Navigasi utama" });
    if (await nav.isVisible()) errors.push("Mobile navigation must be closed on initial page load.");
    await menuButton.click();
    if (!(await nav.isVisible())) errors.push("Mobile navigation did not open.");
    await menuButton.click();
    if (await nav.isVisible()) errors.push("Mobile navigation did not close after toggling.");
  }
  results.push({ name, viewport, metrics, surprise, errors });
  await page.close();
}

try {
  await audit("desktop", { width: 1440, height: 1000 });
  await audit("mobile", { width: 390, height: 844 });
  await auditReducedMotion();
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
  results.push({ name: "interactions", expandedGallery: expanded, lightbox: "open/close passed", reducedMotion: "passed", errors: [] });
  await page.close();
} finally {
  await browser.close();
}
console.log(JSON.stringify(results, null, 2));
if (results.some(result => result.errors.length)) process.exit(1);
