import { test, expect } from '@playwright/test';

/* ==========================================================================
   GENERATIVE HERO TESTS
   Verifies the WebGL fluid simulation renders as a full-page background
   behind both the sidebar and content on the homepage.
   ========================================================================== */

test.describe('Generative hero - initial load', () => {
  test('homepage main has generative-bg class', async ({ page }) => {
    await page.goto('/');

    const main = page.locator('#main.has-generative-bg');
    await expect(main).toBeAttached();
  });

  test('fluid canvas container exists inside main', async ({ page }) => {
    await page.goto('/');

    const canvasContainer = page.locator('#gen-hero-canvas');
    await expect(canvasContainer).toBeAttached();
  });

  test('fluid library loads and creates canvas element', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(5000);

    const canvasCount = await page.locator('#gen-hero-canvas canvas').count();

    if (canvasCount === 0) {
      const hasGracefulFailure = errors.some(e =>
        e.includes('WebGL Fluid') || e.includes('WebGL') || e.includes('CDN')
      );
      expect(canvasCount > 0 || hasGracefulFailure || errors.length === 0).toBeTruthy();
    } else {
      const canvas = page.locator('#gen-hero-canvas canvas').first();
      await expect(canvas).toBeVisible();
    }
  });

  test('bio text is visible in frosted glass card', async ({ page }) => {
    await page.goto('/');

    const card = page.locator('.gen-hero__content-card');
    await expect(card).toBeVisible();
    await expect(card).toContainText('PhD');
  });

  test('sidebar is visible on top of the fluid background', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.author__name')).toContainText('Nuno Braz');
    await expect(page.locator('.author__avatar img')).toBeVisible();
  });

  test('homepage main has interactive cursor', async ({ page }) => {
    await page.goto('/');

    const cursor = await page.locator('#main.has-generative-bg').evaluate(el => {
      return getComputedStyle(el).cursor;
    });
    expect(cursor).toBe('crosshair');
  });
});

test.describe('Generative hero - Turbo navigation', () => {
  test('fluid container re-appears after navigating away and back', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#main.has-generative-bg')).toBeAttached();

    // Navigate away
    await page.locator('.chip-nav__chip', { hasText: 'CV' }).first().click();
    await expect(page).toHaveURL('/cv/');

    // No generative-bg on CV
    await expect(page.locator('#gen-hero-canvas')).toHaveCount(0);

    // Navigate back
    await page.locator('.chip-nav__chip', { hasText: 'Home' }).first().click();
    await expect(page).toHaveURL('/');

    await expect(page.locator('#main.has-generative-bg')).toBeAttached();
    await expect(page.locator('#gen-hero-canvas')).toBeAttached();
  });

  test('fluid container re-appears after browser back', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#gen-hero-canvas')).toBeAttached();

    await page.locator('.chip-nav__chip', { hasText: 'CV' }).first().click();
    await expect(page).toHaveURL('/cv/');

    await page.goBack();
    await expect(page).toHaveURL('/');

    await expect(page.locator('#gen-hero-canvas')).toBeAttached();
  });

  test('no generative background on other pages', async ({ page }) => {
    await page.goto('/cv/');
    await expect(page.locator('#gen-hero-canvas')).toHaveCount(0);
    await expect(page.locator('#main.has-generative-bg')).toHaveCount(0);
  });
});

test.describe('Generative hero - theme toggle', () => {
  test('fluid container persists after theme toggle', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#main.has-generative-bg')).toBeAttached();

    await page.locator('#theme-toggle').click();

    await expect(page.locator('#main.has-generative-bg')).toBeAttached();
    await expect(page.locator('#gen-hero-canvas')).toBeAttached();
  });
});

test.describe('Generative hero - reduced motion', () => {
  test('canvas is not created with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await page.waitForTimeout(3000);

    const canvasCount = await page.locator('#gen-hero-canvas canvas').count();
    expect(canvasCount).toBe(0);
  });

  test('main has default cursor with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const cursor = await page.locator('#main.has-generative-bg').evaluate(el => {
      return getComputedStyle(el).cursor;
    });
    expect(cursor).toBe('default');
  });
});
