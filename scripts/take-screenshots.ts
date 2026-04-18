/**
 * take-screenshots.ts — High-resolution screenshot capture
 *
 * Captures full-page and targeted component screenshots for
 * README, DoraHacks submission, and social sharing.
 *
 * Usage:
 *   cd frontend && npx ts-node ../scripts/take-screenshots.ts
 *   — or —
 *   cd frontend && npm run screenshots
 *
 * Prerequisites:
 *   - `make up` running (frontend on :3000, backend on :8000)
 *   - npx playwright install chromium
 */

import { chromium, Page } from "playwright";
import path from "path";
import fs from "fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUTPUT_DIR = path.resolve(__dirname, "../docs/demo/screenshots");

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function takeScreenshot(
  page: Page,
  name: string,
  opts: { fullPage?: boolean; clip?: { x: number; y: number; width: number; height: number } } = {}
) {
  const filePath = path.join(OUTPUT_DIR, `${name}.png`);
  await page.screenshot({
    path: filePath,
    fullPage: opts.fullPage ?? false,
    clip: opts.clip,
  });
  console.log(`   📸 ${name}.png`);
}

async function main() {
  // Ensure output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    colorScheme: "dark",
    deviceScaleFactor: 2, // Retina-quality screenshots
  });
  const page = await context.newPage();

  console.log("📸 [SCREENSHOTS] Capturing high-res screenshots...\n");

  // ═══════════════════════════════════════════════════════
  // 1. SOC Dashboard — Full page hero
  // ═══════════════════════════════════════════════════════
  console.log("📷 SOC Dashboard screenshots:");
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(4000); // Wait for all animations to settle

  // Full viewport — main hero shot
  await takeScreenshot(page, "01_soc_hero");

  // Full page scroll capture
  await takeScreenshot(page, "02_soc_fullpage", { fullPage: true });

  // Header close-up (GlitchText + Radar + ONLINE badge)
  await takeScreenshot(page, "03_soc_header", {
    clip: { x: 0, y: 0, width: 1920, height: 180 },
  });

  // LiveStatsBar close-up
  await takeScreenshot(page, "04_soc_livestats", {
    clip: { x: 0, y: 140, width: 1920, height: 80 },
  });

  // SessionMonitor (left column)
  await takeScreenshot(page, "05_soc_sessions", {
    clip: { x: 0, y: 200, width: 640, height: 700 },
  });

  // ThreatTimeline (center column)
  await takeScreenshot(page, "06_soc_threats", {
    clip: { x: 620, y: 200, width: 640, height: 700 },
  });

  // RevenueTracker + SOC Overrides (right column)
  await takeScreenshot(page, "07_soc_revenue", {
    clip: { x: 1260, y: 200, width: 660, height: 700 },
  });

  // ═══════════════════════════════════════════════════════
  // 2. RedAlertOverlay — All 4 phases
  // ═══════════════════════════════════════════════════════
  console.log("\n📷 RedAlertOverlay screenshots:");

  // Trigger exploit
  const simulateBtn = page.getByText("SIMULATE EXPLOIT");
  if (await simulateBtn.isVisible()) {
    await simulateBtn.click();

    // Phase 0: THREAT DETECTED
    await sleep(300);
    await takeScreenshot(page, "08_alert_phase0_detected");

    // Phase 1: ANALYZING PAYLOAD
    await sleep(900);
    await takeScreenshot(page, "09_alert_phase1_analyzing");

    // Phase 2: INTERCEPTING TX
    await sleep(1500);
    await takeScreenshot(page, "10_alert_phase2_intercepting");

    // Phase 3: ASSETS SECURED
    await sleep(2000);
    await takeScreenshot(page, "11_alert_phase3_secured");

    // Dismiss
    const dismissBtn = page.locator('button:has(svg.lucide-x)');
    if (await dismissBtn.isVisible()) {
      await dismissBtn.click();
      await sleep(500);
    }
  }

  // ═══════════════════════════════════════════════════════
  // 3. Global Halt state
  // ═══════════════════════════════════════════════════════
  console.log("\n📷 Global Halt screenshots:");

  const haltBtn = page.getByText("GLOBAL HALT");
  if (await haltBtn.isVisible()) {
    await haltBtn.click();
    await sleep(1500);
    await takeScreenshot(page, "12_soc_halted");
  }

  // ═══════════════════════════════════════════════════════
  // 4. /demo — InitiaYield dApp
  // ═══════════════════════════════════════════════════════
  console.log("\n📷 InitiaYield dApp screenshots:");

  await page.goto(`${BASE_URL}/demo`, { waitUntil: "networkidle" });
  await sleep(3000);

  // Full hero
  await takeScreenshot(page, "13_demo_hero");

  // APY card close-up
  await takeScreenshot(page, "14_demo_apy_card", {
    clip: { x: 400, y: 200, width: 1120, height: 500 },
  });

  // Stake the tokens
  const stakeBtn = page.getByText("Approve & Stake INIT");
  if (await stakeBtn.isVisible()) {
    await stakeBtn.click();
    await sleep(3000);
    await takeScreenshot(page, "15_demo_staked");
  }

  // Trigger the attack
  const attackBtn = page.getByText("Simulate Malicious Contract Upgrade");
  if (await attackBtn.isVisible()) {
    await attackBtn.scrollIntoViewIfNeeded();
    await sleep(300);
    await attackBtn.click();
    await sleep(1500);
    await takeScreenshot(page, "16_demo_under_attack");

    // Wait for overlay
    await sleep(3000);
    await takeScreenshot(page, "17_demo_intercepted");

    // Dismiss
    const dismissBtn = page.locator('button:has(svg.lucide-x)');
    if (await dismissBtn.isVisible()) {
      await dismissBtn.click();
      await sleep(500);
    }
  }

  // ═══════════════════════════════════════════════════════
  // 5. /dashboard page
  // ═══════════════════════════════════════════════════════
  console.log("\n📷 Dashboard screenshots:");

  const dashResp = await page.goto(`${BASE_URL}/dashboard`, {
    waitUntil: "networkidle",
  });
  if (dashResp && dashResp.ok()) {
    await sleep(3000);
    await takeScreenshot(page, "18_dashboard_hero");
    await takeScreenshot(page, "19_dashboard_fullpage", { fullPage: true });
  } else {
    console.log("   ⚠ /dashboard not found, skipping");
  }

  // ═══════════════════════════════════════════════════════
  // 6. OG Image / Social Card (1200×630)
  // ═══════════════════════════════════════════════════════
  console.log("\n📷 Social card (1200×630):");

  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(3000);
  await takeScreenshot(page, "20_og_social_card");

  // Reset viewport
  await page.setViewportSize({ width: 1920, height: 1080 });

  // ═══════════════════════════════════════════════════════
  // 7. Mobile viewport (390×844 — iPhone 14)
  // ═══════════════════════════════════════════════════════
  console.log("\n📷 Mobile screenshots (iPhone 14):");

  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(3000);
  await takeScreenshot(page, "21_mobile_soc");

  await page.goto(`${BASE_URL}/demo`, { waitUntil: "networkidle" });
  await sleep(3000);
  await takeScreenshot(page, "22_mobile_demo");

  // ═══════════════════════════════════════════════════════
  // Done
  // ═══════════════════════════════════════════════════════
  await page.close();
  await context.close();
  await browser.close();

  console.log("\n═══════════════════════════════════════════");
  console.log("📸 SCREENSHOTS COMPLETE — 22 images captured");
  console.log(`📁 Output: ${OUTPUT_DIR}/`);
  console.log("═══════════════════════════════════════════\n");
}

main().catch(console.error);
