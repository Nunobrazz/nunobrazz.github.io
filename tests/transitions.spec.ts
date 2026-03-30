import { test, expect } from '@playwright/test';

/* ==========================================================================
   TRANSITIONS & ANIMATION TESTS
   Verifies that transitions are scoped (no blanket transition: all),
   reduced-motion is respected, and theme transitions work properly.
   ========================================================================== */

test.describe('Transition specificity', () => {
  test('links have scoped transitions (not transition: all)', async ({ page }) => {
    // Use CV page which has links in the page content
    await page.goto('/cv/');

    // Wait for a link to exist in page content
    const link = page.locator('.page__content a, .archive a').first();
    await expect(link).toBeAttached({ timeout: 5000 });

    const transition = await link.evaluate(el => {
      return getComputedStyle(el).transitionProperty;
    });

    // Should NOT be 'all'
    expect(transition).not.toBe('all');
  });

  test('buttons have scoped transitions', async ({ page }) => {
    await page.goto('/');

    const transition = await page.locator('.btn').first().evaluate(el => {
      return getComputedStyle(el).transitionProperty;
    });

    expect(transition).not.toBe('all');
  });

  test('chip nav chips have scoped transitions', async ({ page }) => {
    await page.goto('/');

    const transition = await page.locator('.chip-nav__chip').first().evaluate(el => {
      return getComputedStyle(el).transitionProperty;
    });

    expect(transition).not.toBe('all');
    expect(transition).toMatch(/transform|color|background|border|box-shadow/);
  });
});

test.describe('Reduced motion support', () => {
  test('animations are disabled with prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Check that transition-duration is near zero
    const duration = await page.locator('.chip-nav__chip').first().evaluate(el => {
      return getComputedStyle(el).transitionDuration;
    });

    // Should be very short (0.01ms from our CSS) or 0s
    const ms = parseFloat(duration);
    expect(ms).toBeLessThanOrEqual(0.02);
  });

  test('page is usable with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Navigation should still work
    await page.locator('.chip-nav__chip', { hasText: 'CV' }).first().click();
    await expect(page).toHaveURL('/cv/');

    // Theme toggle should still work
    const themeBefore = await page.locator('html').getAttribute('data-theme');
    await page.locator('#theme-toggle').click();
    const themeAfter = await page.locator('html').getAttribute('data-theme');
    expect(themeAfter).not.toBe(themeBefore);
  });
});

test.describe('Theme switching transitions', () => {
  test('theme toggle updates theme-color meta tags', async ({ page }) => {
    await page.goto('/');

    // Get initial theme-color values
    const getMetaColors = () => page.evaluate(() => {
      const metas = document.querySelectorAll('meta[name="theme-color"]');
      return Array.from(metas).map(m => m.getAttribute('content'));
    });

    const colorsBefore = await getMetaColors();

    // Toggle theme
    await page.locator('#theme-toggle').click();
    await page.waitForTimeout(300);

    const colorsAfter = await getMetaColors();

    // Colors should have changed
    expect(colorsAfter).not.toEqual(colorsBefore);
  });

  test('theme toggle updates color-scheme on html', async ({ page }) => {
    await page.goto('/');

    const schemeBefore = await page.locator('html').evaluate(el => el.style.colorScheme);

    await page.locator('#theme-toggle').click();
    await page.waitForTimeout(200);

    const schemeAfter = await page.locator('html').evaluate(el => el.style.colorScheme);
    expect(schemeAfter).not.toBe(schemeBefore);
  });
});

test.describe('Citation text styling', () => {
  test('citation-text class exists and reduces font size', async ({ page }) => {
    // Navigate to a page that might have citations (publications)
    await page.goto('/');

    // Inject a citation-text element to test the CSS class
    const fontSize = await page.evaluate(() => {
      const el = document.createElement('p');
      el.className = 'citation-text';
      el.textContent = 'Test citation';
      document.body.appendChild(el);
      const size = getComputedStyle(el).fontSize;
      el.remove();
      return parseFloat(size);
    });

    // "smaller" typically reduces font size by ~83% (roughly 13-15px from 16-18px base)
    expect(fontSize).toBeLessThan(18);
  });
});
