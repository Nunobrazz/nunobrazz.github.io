import { test, expect } from '@playwright/test';

/* ==========================================================================
   NAVIGATION TESTS
   Verifies that every chip-nav link navigates to the correct page,
   the masthead updates the section title, and the active chip highlights.
   ========================================================================== */

const NAV_ITEMS = [
  { label: 'Home',       path: '/',              titleContains: 'Home' },
  { label: 'CV',         path: '/cv/',            titleContains: 'CV' },
  { label: 'Projects',   path: '/projects/',      titleContains: 'Projects' },
  { label: 'Teaching',   path: '/teaching/',       titleContains: 'Teaching' },
  { label: 'Blog Posts', path: '/year-archive/',   titleContains: 'Blog Posts' },
  { label: 'Footprints', path: '/footprints/',     titleContains: 'Footprints' },
  { label: 'Services',   path: '/services/',       titleContains: 'Services' },
];

test.describe('Chip nav navigation', () => {
  for (const item of NAV_ITEMS) {
    test(`clicking "${item.label}" navigates to ${item.path}`, async ({ page }) => {
      // Start from a different page so the click actually navigates
      await page.goto(item.path === '/' ? '/cv/' : '/');

      // Click the chip
      const chip = page.locator('.chip-nav__chip', { hasText: item.label }).first();
      await expect(chip).toBeVisible();
      await chip.click();

      // Verify URL
      await expect(page).toHaveURL(item.path);

      // Verify the active chip is highlighted
      const activeChip = page.locator('.chip-nav__chip.is-active');
      await expect(activeChip).toHaveText(item.label);

      // Verify the masthead section title updated
      const sectionTitle = page.locator('#masthead-section-title');
      await expect(sectionTitle).toContainText(item.titleContains);
    });
  }
});

test.describe('Masthead layout', () => {
  test('masthead contains title, chip nav, and theme toggle', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.masthead')).toBeVisible();
    await expect(page.locator('#masthead-section-title')).toBeVisible();
    await expect(page.locator('#chip-nav')).toBeVisible();
    await expect(page.locator('#theme-toggle')).toBeVisible();
  });

  test('all chip nav items are visible', async ({ page }) => {
    await page.goto('/');

    for (const item of NAV_ITEMS) {
      const chip = page.locator('.chip-nav__chip', { hasText: item.label }).first();
      await expect(chip).toBeVisible();
    }
  });

  test('masthead is not broken into vertical list', async ({ page }) => {
    await page.goto('/');

    // The masthead inner wrap should use flexbox (horizontal layout)
    const innerWrap = page.locator('.masthead__inner-wrap');
    const display = await innerWrap.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('flex');

    // Chip nav track should also be flex (horizontal)
    const track = page.locator('#chip-nav-track');
    const trackDisplay = await track.evaluate(el => getComputedStyle(el).display);
    expect(trackDisplay).toBe('flex');
  });
});
