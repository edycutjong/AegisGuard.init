/**
 * record-broll.ts — B-Roll footage recorder
 *
 * Records individual B-roll clips for each visual element,
 * each as a separate video file. Great for compositing in
 * a video editor alongside narration.
 *
 * Usage:
 *   cd frontend && npx ts-node ../scripts/record-broll.ts
 *   — or —
 *   cd frontend && npm run demo:broll
 *
 * Prerequisites:
 *   - `make up` running (frontend on :3000, backend on :8000)
 *   - npx playwright install chromium
 */

import { chromium, Browser, BrowserContext, Page } from "playwright";
import path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUTPUT_DIR = path.resolve(__dirname, "../docs/demo/broll");

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Create a fresh context with video recording for a specific clip.
 */
async function createClipContext(
  browser: Browser,
  clipName: string
): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: path.join(OUTPUT_DIR, clipName),
      size: { width: 1920, height: 1080 },
    },
    colorScheme: "dark",
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  return { context, page };
}

async function main() {
  const browser = await chromium.launch({ headless: false });

  console.log("🎥 [B-ROLL] Starting individual clip recording...\n");

  // ═══════════════════════════════════════════════════════════════
  // CLIP 1: SOC Dashboard — Full page load with stagger animations
  // ═══════════════════════════════════════════════════════════════
  {
    console.log("📹 Clip 1: SOC Dashboard full-page load");
    const { context, page } = await createClipContext(browser, "01_soc_load");

    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await sleep(6000); // Capture full stagger animation + LiveStatsBar count-up

    await page.close();
    await context.close();
    console.log("   ✅ Done\n");
  }

  // ═══════════════════════════════════════════════════════════════
  // CLIP 2: LiveStatsBar count-up animation (close-up)
  // ═══════════════════════════════════════════════════════════════
  {
    console.log("📹 Clip 2: LiveStatsBar count-up");
    const { context, page } = await createClipContext(browser, "02_livestats");

    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await sleep(1000);

    // Zoom into the LiveStatsBar area by evaluating CSS
    await page.evaluate(() => {
      document.body.style.transform = "scale(2)";
      document.body.style.transformOrigin = "top center";
      document.body.style.overflow = "hidden";
    });
    await sleep(5000);

    await page.close();
    await context.close();
    console.log("   ✅ Done\n");
  }

  // ═══════════════════════════════════════════════════════════════
  // CLIP 3: SessionMonitor — Hover + REVOKE flow
  // ═══════════════════════════════════════════════════════════════
  {
    console.log("📹 Clip 3: SessionMonitor — Hover + Revoke");
    const { context, page } = await createClipContext(browser, "03_sessions");

    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await sleep(3000);

    // Hover over sessions area (left column)
    await page.mouse.move(300, 400, { steps: 20 });
    await sleep(1500);

    // Hover REVOKE button
    const revokeBtn = page.getByText("REVOKE").first();
    if (await revokeBtn.isVisible()) {
      await revokeBtn.hover();
      await sleep(1000);
      await revokeBtn.click();
      await sleep(2000);
    }

    await page.close();
    await context.close();
    console.log("   ✅ Done\n");
  }

  // ═══════════════════════════════════════════════════════════════
  // CLIP 4: ThreatTimeline panel
  // ═══════════════════════════════════════════════════════════════
  {
    console.log("📹 Clip 4: ThreatTimeline panel");
    const { context, page } = await createClipContext(browser, "04_threats");

    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await sleep(3000);

    // Hover center column
    await page.mouse.move(700, 400, { steps: 20 });
    await sleep(3000);

    // Slowly scroll inside the threat timeline
    await page.mouse.move(700, 500);
    await page.mouse.wheel(0, 200);
    await sleep(2000);

    await page.close();
    await context.close();
    console.log("   ✅ Done\n");
  }

  // ═══════════════════════════════════════════════════════════════
  // CLIP 5: RevenueTracker chart + SOC Overrides
  // ═══════════════════════════════════════════════════════════════
  {
    console.log("📹 Clip 5: RevenueTracker + SOC Overrides");
    const { context, page } = await createClipContext(browser, "05_revenue");

    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await sleep(3000);

    // Hover over chart area
    await page.mouse.move(1400, 350, { steps: 20 });
    await sleep(2000);

    // Move to SOC Overrides
    await page.mouse.move(1400, 750, { steps: 20 });
    await sleep(2000);

    await page.close();
    await context.close();
    console.log("   ✅ Done\n");
  }

  // ═══════════════════════════════════════════════════════════════
  // CLIP 6: SIMULATE EXPLOIT → RedAlertOverlay full flow
  // ═══════════════════════════════════════════════════════════════
  {
    console.log("📹 Clip 6: SIMULATE EXPLOIT → RedAlertOverlay");
    const { context, page } = await createClipContext(browser, "06_intercept");

    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await sleep(3000);

    // Click SIMULATE EXPLOIT
    const btn = page.getByText("SIMULATE EXPLOIT");
    await btn.hover();
    await sleep(800);
    await btn.click();

    // Wait for all 4 phases (3.5s total) + hold
    await sleep(6000);

    // Dismiss
    const dismissBtn = page.locator('button:has(svg.lucide-x)');
    if (await dismissBtn.isVisible()) {
      await dismissBtn.click();
      await sleep(2000);
    }

    await page.close();
    await context.close();
    console.log("   ✅ Done\n");
  }

  // ═══════════════════════════════════════════════════════════════
  // CLIP 7: Stealth intercept via CMD+SHIFT+A
  // ═══════════════════════════════════════════════════════════════
  {
    console.log("📹 Clip 7: Stealth intercept (Cmd+Shift+A)");
    const { context, page } = await createClipContext(browser, "07_stealth");

    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await sleep(3000);

    // Trigger stealth intercept
    await page.keyboard.press("Meta+Shift+a");
    await sleep(6000); // Wait for overlay phases

    const dismissBtn = page.locator('button:has(svg.lucide-x)');
    if (await dismissBtn.isVisible()) {
      await dismissBtn.click();
      await sleep(2000);
    }

    await page.close();
    await context.close();
    console.log("   ✅ Done\n");
  }

  // ═══════════════════════════════════════════════════════════════
  // CLIP 8: GLOBAL HALT button
  // ═══════════════════════════════════════════════════════════════
  {
    console.log("📹 Clip 8: GLOBAL HALT");
    const { context, page } = await createClipContext(browser, "08_halt");

    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await sleep(3000);

    const haltBtn = page.getByText("GLOBAL HALT");
    if (await haltBtn.isVisible()) {
      await haltBtn.hover();
      await sleep(800);
      await haltBtn.click();
      await sleep(4000);
    }

    await page.close();
    await context.close();
    console.log("   ✅ Done\n");
  }

  // ═══════════════════════════════════════════════════════════════
  // CLIP 9: /demo — InitiaYield page load + floating tokens
  // ═══════════════════════════════════════════════════════════════
  {
    console.log("📹 Clip 9: InitiaYield dApp — page load");
    const { context, page } = await createClipContext(browser, "09_demo_load");

    await page.goto(`${BASE_URL}/demo`, { waitUntil: "networkidle" });
    await sleep(6000); // Let gradient bg, floating tokens, APY all animate

    await page.close();
    await context.close();
    console.log("   ✅ Done\n");
  }

  // ═══════════════════════════════════════════════════════════════
  // CLIP 10: /demo — Stake flow + attack trigger
  // ═══════════════════════════════════════════════════════════════
  {
    console.log("📹 Clip 10: InitiaYield — Stake + Attack");
    const { context, page } = await createClipContext(browser, "10_demo_attack");

    await page.goto(`${BASE_URL}/demo`, { waitUntil: "networkidle" });
    await sleep(3000);

    // Stake
    const stakeBtn = page.getByText("Approve & Stake INIT");
    if (await stakeBtn.isVisible()) {
      await stakeBtn.click();
      await sleep(3000);
    }

    // Attack
    const attackBtn = page.getByText("Simulate Malicious Contract Upgrade");
    if (await attackBtn.isVisible()) {
      await attackBtn.scrollIntoViewIfNeeded();
      await sleep(600);
      await attackBtn.click();
      await sleep(7000); // Full overlay progression

      const dismissBtn = page.locator('button:has(svg.lucide-x)');
      if (await dismissBtn.isVisible()) {
        await dismissBtn.click();
        await sleep(2000);
      }
    }

    await page.close();
    await context.close();
    console.log("   ✅ Done\n");
  }

  // ═══════════════════════════════════════════════════════════════
  // CLIP 11: HexGrid background ambience (for overlays)
  // ═══════════════════════════════════════════════════════════════
  {
    console.log("📹 Clip 11: HexGrid ambient background");
    const { context, page } = await createClipContext(browser, "11_hexgrid_bg");

    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await sleep(2000);

    // Hide all UI, show only the hex grid canvas background
    await page.evaluate(() => {
      const els = document.querySelectorAll("header, main, nav");
      els.forEach((el) => ((el as HTMLElement).style.display = "none"));
    });
    await sleep(8000); // Record pure hex grid animation

    await page.close();
    await context.close();
    console.log("   ✅ Done\n");
  }

  // ═══════════════════════════════════════════════════════════════
  // CLIP 12: /dashboard page (if exists)
  // ═══════════════════════════════════════════════════════════════
  {
    console.log("📹 Clip 12: Dashboard page");
    const { context, page } = await createClipContext(browser, "12_dashboard");

    const resp = await page.goto(`${BASE_URL}/dashboard`, {
      waitUntil: "networkidle",
    });
    if (resp && resp.ok()) {
      await sleep(5000);
    } else {
      console.log("   ⚠ /dashboard not found, skipping");
    }

    await page.close();
    await context.close();
    console.log("   ✅ Done\n");
  }

  await browser.close();

  console.log("═══════════════════════════════════════════");
  console.log("🎥 B-ROLL COMPLETE — 12 clips recorded");
  console.log(`📁 Output: ${OUTPUT_DIR}/`);
  console.log("═══════════════════════════════════════════\n");
}

main().catch(console.error);
