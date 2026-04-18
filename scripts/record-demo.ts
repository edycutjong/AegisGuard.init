/**
 * record-demo.ts — Full demo recording synced with ElevenLabs narration
 *
 * Records the complete AegisGuard demo walkthrough timed to match the
 * 3 narration audio clips in docs/demo/.
 *
 * Usage:
 *   cd frontend && npx ts-node ../scripts/record-demo.ts
 *   — or —
 *   cd frontend && npm run demo:record
 *
 * Prerequisites:
 *   - `make up` running (frontend on :3000, backend on :8000)
 *   - npx playwright install chromium
 */

import { chromium } from "playwright";
import path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUTPUT_DIR = path.resolve(__dirname, "../docs/demo/recordings");

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: OUTPUT_DIR,
      size: { width: 1920, height: 1080 },
    },
    colorScheme: "dark",
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  console.log("🎬 [DEMO] Starting full demo recording...\n");

  // ─── SCENE 1: The Hook — SOC Dashboard Load (match narr_01) ────────
  console.log("🎬 SCENE 1: The Hook — SOC Landing");
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(2000); // Let stagger animations complete

  // Slow scroll to reveal all panels
  await page.mouse.move(960, 540);
  await sleep(1000);

  // Let LiveStatsBar count up, StatusTicker scroll
  await sleep(5000);

  // ─── SCENE 2: SOC Tour — Pan across 3 columns ────────────────────
  console.log("🎬 SCENE 2: SOC Tour — Pan across panels");

  // Hover over SessionMonitor (left column)
  await page.mouse.move(300, 500, { steps: 30 });
  await sleep(2000);

  // Hover over ThreatTimeline (center column)
  await page.mouse.move(700, 500, { steps: 30 });
  await sleep(2000);

  // Hover over RevenueTracker (right column)
  await page.mouse.move(1400, 400, { steps: 30 });
  await sleep(2000);

  // Hover over SOC Overrides panel
  await page.mouse.move(1400, 750, { steps: 20 });
  await sleep(1500);

  // ─── SCENE 3: The Intercept — Simulate Exploit ────────────────────
  console.log("🎬 SCENE 3: The Intercept — SIMULATE EXPLOIT");

  // Click "SIMULATE EXPLOIT" button
  const simulateBtn = page.getByText("SIMULATE EXPLOIT");
  await simulateBtn.scrollIntoViewIfNeeded();
  await sleep(500);

  // Hover to show the shimmer effect
  await simulateBtn.hover();
  await sleep(1000);

  // Click!
  await simulateBtn.click();
  console.log("   ⚡ Exploit triggered — RedAlertOverlay active");

  // Wait for all 4 phases of RedAlertOverlay:
  // Phase 0 (0ms): THREAT DETECTED
  // Phase 1 (800ms): ANALYZING PAYLOAD
  // Phase 2 (2000ms): INTERCEPTING TX
  // Phase 3 (3500ms): ASSETS SECURED
  await sleep(1000);
  console.log("   Phase 0: THREAT DETECTED");

  await sleep(1200);
  console.log("   Phase 1: ANALYZING PAYLOAD");

  await sleep(1500);
  console.log("   Phase 2: INTERCEPTING TX");

  await sleep(2000);
  console.log("   Phase 3: ASSETS SECURED ✅");

  // Hold on the green "ASSETS SECURED" state
  await sleep(3000);

  // Dismiss the overlay
  const dismissBtn = page.locator('button:has(svg.lucide-x)');
  if (await dismissBtn.isVisible()) {
    await dismissBtn.click();
    console.log("   Dismissed RedAlertOverlay");
  }
  await sleep(2000);

  // ─── SCENE 4: Victim Perspective — /demo page ────────────────────
  console.log("\n🎬 SCENE 4: Victim Perspective — InitiaYield dApp");
  await page.goto(`${BASE_URL}/demo`, { waitUntil: "networkidle" });
  await sleep(3000); // Let animations settle

  // Show APY fluctuating
  await sleep(3000);

  // Click "Approve & Stake INIT"
  const stakeBtn = page.getByText("Approve & Stake INIT");
  if (await stakeBtn.isVisible()) {
    await stakeBtn.hover();
    await sleep(500);
    await stakeBtn.click();
    console.log("   Staking INIT...");
    await sleep(3000); // Wait for staking animation + success message
  }

  // Click "Simulate Malicious Contract Upgrade"
  const attackBtn = page.getByText("Simulate Malicious Contract Upgrade");
  if (await attackBtn.isVisible()) {
    await attackBtn.scrollIntoViewIfNeeded();
    await sleep(500);
    await attackBtn.hover();
    await sleep(800);
    await attackBtn.click();
    console.log("   ⚠ Malicious upgrade triggered!");

    // Wait for red bg effect + AegisGuard interception messages
    await sleep(2000);

    // Wait for RedAlertOverlay phases
    await sleep(5000);
    console.log("   🛡 AegisGuard intercepted — ASSETS SECURED");

    // Hold on secured state
    await sleep(3000);

    // Dismiss
    const dismissBtn2 = page.locator('button:has(svg.lucide-x)');
    if (await dismissBtn2.isVisible()) {
      await dismissBtn2.click();
    }
    await sleep(2000);
  }

  // ─── SCENE 5: Session Revocation ────────────────────────────────
  console.log("\n🎬 SCENE 5: Session Revocation");
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await sleep(3000);

  // Click a REVOKE button on an active session
  const revokeBtn = page.getByText("REVOKE").first();
  if (await revokeBtn.isVisible()) {
    await revokeBtn.hover();
    await sleep(500);
    await revokeBtn.click();
    console.log("   Session revoked");
    await sleep(2000);
  }

  // Click GLOBAL HALT
  const haltBtn = page.getByText("GLOBAL HALT");
  if (await haltBtn.isVisible()) {
    await haltBtn.hover();
    await sleep(800);
    await haltBtn.click();
    console.log("   ⛔ GLOBAL HALT executed");
    await sleep(3000);
  }

  // ─── SCENE 6: Hold on final dashboard ──────────────────────────
  console.log("\n🎬 SCENE 6: Final hero shot");
  await sleep(5000);

  // ─── DONE ──────────────────────────────────────────────────────
  console.log("\n✅ Demo recording complete!");
  console.log(`📁 Video saved to: ${OUTPUT_DIR}/\n`);

  await page.close();
  await context.close();
  await browser.close();
}

main().catch(console.error);
