import { test, expect } from '@playwright/test';

/* ==========================================================================
   THEME TOGGLE TESTS
   Verifies dark/light theme switching and persistence across navigations.

   Note: The default theme depends on OS preference. Playwright's Chromium
   typically reports prefers-color-scheme: light, so the page may start
   in light mode. Tests account for either starting state.
   ========================================================================== */

test.describe('Theme toggle', () => {
  test('theme toggle button is clickable', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('#theme-toggle');
    await expect(toggle).toBeVisible();
    await expect(toggle).toBeEnabled();
  });

  test('clicking toggle changes the theme', async ({ page }) => {
    await page.goto('/');

    // Read starting theme
    const startTheme = await page.locator('html').getAttribute('data-theme');

    // Click the theme toggle
    await page.locator('#theme-toggle').click();

    // Theme should have changed
    const newTheme = await page.locator('html').getAttribute('data-theme');
    expect(newTheme).not.toBe(startTheme);
  });

  test('clicking toggle twice returns to original theme', async ({ page }) => {
    await page.goto('/');

    const startTheme = await page.locator('html').getAttribute('data-theme');

    await page.locator('#theme-toggle').click();
    await page.locator('#theme-toggle').click();

    const finalTheme = await page.locator('html').getAttribute('data-theme');
    expect(finalTheme).toBe(startTheme);
  });

  test('theme persists across page navigation', async ({ page }) => {
    await page.goto('/');

    // Read starting theme, toggle it
    const startTheme = await page.locator('html').getAttribute('data-theme');
    await page.locator('#theme-toggle').click();
    const toggledTheme = await page.locator('html').getAttribute('data-theme');
    expect(toggledTheme).not.toBe(startTheme);

    // Navigate to another page
    await page.locator('.chip-nav__chip', { hasText: 'CV' }).first().click();
    await expect(page).toHaveURL('/cv/');

    // Theme should persist
    const themeAfterNav = await page.locator('html').getAttribute('data-theme');
    expect(themeAfterNav).toBe(toggledTheme);
  });

  test('theme icon updates when toggled', async ({ page }) => {
    await page.goto('/');

    const iconBefore = await page.locator('#theme-icon').getAttribute('class');
    await page.locator('#theme-toggle').click();
    const iconAfter = await page.locator('#theme-icon').getAttribute('class');

    // Icon class should have changed (sun <-> moon)
    expect(iconAfter).not.toBe(iconBefore);
  });
});
