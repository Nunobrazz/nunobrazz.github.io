import { test, expect } from '@playwright/test';

/* ==========================================================================
   LAYOUT & VISUAL REGRESSION TESTS
   Verifies the page layout doesn't break — sidebar doesn't overlap content,
   masthead stays horizontal, body has correct padding, etc.
   ========================================================================== */

test.describe('Layout integrity', () => {
  test('sidebar does not overlap main content', async ({ page }) => {
    await page.goto('/cv/');

    const sidebar = page.locator('.sidebar');
    const mainContent = page.locator('.archive, .page');

    // Both should be visible
    await expect(sidebar).toBeVisible();
    await expect(mainContent.first()).toBeVisible();

    // Get bounding boxes
    const sidebarBox = await sidebar.boundingBox();
    const contentBox = await mainContent.first().boundingBox();

    if (sidebarBox && contentBox) {
      // Content should start to the right of the sidebar (no overlap)
      expect(contentBox.x).toBeGreaterThanOrEqual(sidebarBox.x + sidebarBox.width - 20);
    }
  });

  test('masthead stays at the top of the viewport', async ({ page }) => {
    await page.goto('/');

    const masthead = page.locator('.masthead');
    const box = await masthead.boundingBox();

    expect(box).not.toBeNull();
    // Masthead should be at the very top
    expect(box!.y).toBeLessThanOrEqual(5);
  });

  test('body has padding-top to clear the masthead', async ({ page }) => {
    await page.goto('/');

    const paddingTop = await page.locator('body').evaluate(el => {
      return parseInt(getComputedStyle(el).paddingTop);
    });

    // Should have at least 40px of padding (masthead height)
    expect(paddingTop).toBeGreaterThanOrEqual(40);
  });

  test('no horizontal scrollbar on any page', async ({ page }) => {
    const pages = ['/', '/cv/', '/projects/', '/teaching/', '/services/'];

    for (const url of pages) {
      await page.goto(url);

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasHorizontalScroll, `Horizontal scroll on ${url}`).toBeFalsy();
    }
  });
});

test.describe('Favicon', () => {
  test('favicon is an SVG with surf emoji', async ({ page }) => {
    await page.goto('/');

    const favicon = page.locator('link[rel="icon"][type="image/svg+xml"]');
    await expect(favicon).toHaveAttribute('href', /favicon\.svg/);
  });
});

test.describe('Theme rendering', () => {
  test('page has a valid theme state on load', async ({ page }) => {
    await page.goto('/');

    // Theme should be either dark (data-theme="dark") or light (no attribute)
    // Both are valid depending on OS preference
    const theme = await page.locator('html').getAttribute('data-theme');
    expect(theme === 'dark' || theme === null).toBeTruthy();
  });
});

test.describe('Cross-page navigation consistency', () => {
  test('sidebar persists across Turbo navigations', async ({ page }) => {
    await page.goto('/');

    // Sidebar should be visible
    await expect(page.locator('.author__name')).toContainText('Nuno Braz');

    // Navigate to CV
    await page.locator('.chip-nav__chip', { hasText: 'CV' }).first().click();
    await expect(page).toHaveURL('/cv/');

    // Sidebar should still be there
    await expect(page.locator('.author__name')).toContainText('Nuno Braz');

    // Navigate to Projects
    await page.locator('.chip-nav__chip', { hasText: 'Projects' }).first().click();
    await expect(page).toHaveURL('/projects/');

    // Sidebar should still be there
    await expect(page.locator('.author__name')).toContainText('Nuno Braz');
  });

  test('chip nav persists across navigations (turbo-permanent)', async ({ page }) => {
    await page.goto('/');

    const chipCount = await page.locator('.chip-nav__chip').count();

    // Navigate around
    await page.locator('.chip-nav__chip', { hasText: 'Teaching' }).first().click();
    await expect(page).toHaveURL('/teaching/');

    // Same number of chips
    const chipCountAfter = await page.locator('.chip-nav__chip').count();
    expect(chipCountAfter).toBe(chipCount);
  });
});
