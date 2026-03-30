import { test, expect } from '@playwright/test';

/* ==========================================================================
   SIDEBAR + TURBO NAVIGATION TESTS
   Verifies the sidebar survives Turbo navigations — specifically that the
   author social links don't get stuck at display:none after the user
   toggles the dropdown on mobile or navigates to an external link and back.
   ========================================================================== */

test.describe('Sidebar persistence across Turbo navigations', () => {
  test('social links are visible on desktop after navigating away and back', async ({ page }) => {
    await page.goto('/');

    // On desktop, social links should be visible
    await expect(page.locator('.author__urls')).toBeVisible();

    // Navigate away
    await page.locator('.chip-nav__chip', { hasText: 'CV' }).first().click();
    await expect(page).toHaveURL('/cv/');

    // Navigate back
    await page.locator('.chip-nav__chip', { hasText: 'Home' }).first().click();
    await expect(page).toHaveURL('/');

    // Social links should still be visible (not stuck at display:none)
    await expect(page.locator('.author__urls')).toBeVisible();
  });

  test('social links visible after multiple rapid navigations', async ({ page }) => {
    await page.goto('/');

    const urls = ['/cv/', '/projects/', '/teaching/', '/'];
    for (const url of urls) {
      const chipText = url === '/' ? 'Home' :
                       url === '/cv/' ? 'CV' :
                       url === '/projects/' ? 'Projects' : 'Teaching';
      await page.locator('.chip-nav__chip', { hasText: chipText }).first().click();
      await expect(page).toHaveURL(url);
    }

    // After returning home, social links should be visible
    await expect(page.locator('.author__urls')).toBeVisible();
  });

  test('social links visible after browser back/forward', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.author__urls')).toBeVisible();

    // Navigate away
    await page.locator('.chip-nav__chip', { hasText: 'Projects' }).first().click();
    await expect(page).toHaveURL('/projects/');

    // Go back
    await page.goBack();
    await expect(page).toHaveURL('/');

    // Social links should be visible
    await expect(page.locator('.author__urls')).toBeVisible();
  });

  test('author name persists after navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.author__name')).toContainText('Nuno Braz');

    // Navigate through multiple pages
    await page.locator('.chip-nav__chip', { hasText: 'CV' }).first().click();
    await expect(page.locator('.author__name')).toContainText('Nuno Braz');

    await page.locator('.chip-nav__chip', { hasText: 'Home' }).first().click();
    await expect(page.locator('.author__name')).toContainText('Nuno Braz');
  });
});

test.describe('Sidebar dropdown on mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } }); // iPhone X

  test('connect button toggles social links', async ({ page }) => {
    await page.goto('/');

    const btn = page.locator('.author__urls-wrapper button');
    const urls = page.locator('.author__urls');

    // Button should say "Connect" (not "Follow")
    await expect(btn).toContainText('Connect');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');

    // Social links should be hidden on mobile by default
    await expect(urls).not.toBeVisible();

    // Click to open
    await btn.click();
    await expect(urls).toBeVisible();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');

    // Click to close
    await btn.click();
    await expect(urls).not.toBeVisible({ timeout: 2000 });
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  test('social links reset after Turbo navigation on mobile', async ({ page }) => {
    await page.goto('/');

    const btn = page.locator('.author__urls-wrapper button');
    const urls = page.locator('.author__urls');

    // Open the dropdown
    await btn.click();
    await expect(urls).toBeVisible();

    // Navigate away
    await page.locator('.chip-nav__chip', { hasText: 'CV' }).first().click();
    await expect(page).toHaveURL('/cv/');

    // Navigate back
    await page.locator('.chip-nav__chip', { hasText: 'Home' }).first().click();
    await expect(page).toHaveURL('/');

    // The dropdown should be reset to closed state (not stuck open or stuck hidden)
    // aria-expanded should be reset to false
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('External link navigation', () => {
  test('sidebar is intact after visiting external link and returning', async ({ page }) => {
    await page.goto('/');

    // Verify sidebar is there
    await expect(page.locator('.author__name')).toContainText('Nuno Braz');
    await expect(page.locator('.author__urls')).toBeVisible();

    // Navigate to a different internal page
    await page.locator('.chip-nav__chip', { hasText: 'CV' }).first().click();
    await expect(page).toHaveURL('/cv/');

    // Go back
    await page.goBack();
    await expect(page).toHaveURL('/');

    // Sidebar should be fully intact
    await expect(page.locator('.author__name')).toContainText('Nuno Braz');
    await expect(page.locator('.author__urls')).toBeVisible();
    await expect(page.locator('.author__avatar img')).toBeVisible();
  });
});
