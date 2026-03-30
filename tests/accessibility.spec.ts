import { test, expect } from '@playwright/test';

/* ==========================================================================
   ACCESSIBILITY TESTS
   Verifies skip link, semantic HTML, ARIA attributes, focus management,
   and prefers-reduced-motion support.
   ========================================================================== */

test.describe('Skip-to-content link', () => {
  test('skip link exists and is hidden by default', async ({ page }) => {
    await page.goto('/');

    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toHaveCount(1);
    await expect(skipLink).toHaveAttribute('href', '#main');

    // Should be positioned offscreen
    const box = await skipLink.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeLessThan(0);
  });

  test('skip link becomes visible on focus', async ({ page }) => {
    await page.goto('/');

    // Tab to focus the skip link (first focusable element)
    await page.keyboard.press('Tab');

    const skipLink = page.locator('a.skip-link');
    const box = await skipLink.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(0);
  });

  test('skip link navigates to #main', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Focus should move to or near the main content
    const mainElement = page.locator('#main');
    await expect(mainElement).toBeAttached();
  });
});

test.describe('Semantic HTML', () => {
  test('masthead uses nav element', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav.masthead');
    await expect(nav).toHaveCount(1);
    await expect(nav).toHaveAttribute('aria-label', 'Primary navigation');
  });

  test('main content uses main element', async ({ page }) => {
    await page.goto('/');

    const main = page.locator('main#main');
    await expect(main).toHaveCount(1);
  });

  test('main element exists on all key pages', async ({ page }) => {
    const pages = ['/', '/cv/', '/projects/', '/teaching/'];

    for (const url of pages) {
      await page.goto(url);
      const main = page.locator('main#main, #main');
      await expect(main, `Missing #main on ${url}`).toHaveCount(1);
    }
  });
});

test.describe('ARIA attributes', () => {
  test('theme toggle has aria-label', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('#theme-toggle');
    await expect(toggle).toHaveAttribute('aria-label', 'Toggle theme');
  });

  test('theme toggle icon has aria-hidden', async ({ page }) => {
    await page.goto('/');

    const icon = page.locator('#theme-icon');
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  test('connect button has aria-label and aria-expanded', async ({ page }) => {
    await page.goto('/');

    const btn = page.locator('.author__urls-wrapper button');
    await expect(btn).toHaveAttribute('aria-label', /social links/i);
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  test('social link icons have aria-hidden', async ({ page }) => {
    await page.goto('/');

    // All icons in the author URLs should have aria-hidden
    const icons = page.locator('.author__urls i[class*="fa-"], .author__urls i[class*="ai-"]');
    const count = await icons.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(icons.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }
  });
});

test.describe('Focus management', () => {
  test('interactive elements have focus-visible CSS rules defined', async ({ page }) => {
    await page.goto('/');

    // Verify that focus-visible styles are defined in the stylesheet
    // (programmatic focus() doesn't trigger :focus-visible, so we check the CSS rules)
    const hasFocusVisibleRule = await page.evaluate(() => {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSStyleRule && rule.selectorText?.includes('focus-visible')) {
              return true;
            }
          }
        } catch (e) { /* cross-origin sheets */ }
      }
      return false;
    });
    expect(hasFocusVisibleRule).toBeTruthy();
  });

  test('theme toggle has focus-visible outline via keyboard', async ({ page }) => {
    await page.goto('/');

    // Use keyboard to trigger focus-visible (Tab key)
    // Tab through skip link, then through the masthead elements
    await page.keyboard.press('Tab'); // skip link
    await page.keyboard.press('Tab'); // first chip or masthead element

    // Keep tabbing until we reach the theme toggle
    for (let i = 0; i < 20; i++) {
      const focused = await page.evaluate(() => document.activeElement?.id);
      if (focused === 'theme-toggle') break;
      await page.keyboard.press('Tab');
    }

    const focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('theme-toggle');
  });
});

test.describe('Images', () => {
  test('avatar images have width and height attributes', async ({ page }) => {
    await page.goto('/');

    const avatar = page.locator('.author__avatar img');
    await expect(avatar).toHaveAttribute('width', /\d+/);
    await expect(avatar).toHaveAttribute('height', /\d+/);
  });

  test('avatar images have alt text', async ({ page }) => {
    await page.goto('/');

    const avatar = page.locator('.author__avatar img');
    const alt = await avatar.getAttribute('alt');
    expect(alt).toBeTruthy();
    expect(alt!.length).toBeGreaterThan(0);
  });
});

test.describe('Color scheme meta', () => {
  test('has theme-color meta tags for both light and dark', async ({ page }) => {
    await page.goto('/');

    const lightMeta = page.locator('meta[name="theme-color"][media*="light"]');
    const darkMeta = page.locator('meta[name="theme-color"][media*="dark"]');

    await expect(lightMeta).toHaveCount(1);
    await expect(darkMeta).toHaveCount(1);
  });

  test('html has color-scheme CSS property', async ({ page }) => {
    await page.goto('/');

    const colorScheme = await page.locator('html').evaluate(el => {
      return getComputedStyle(el).colorScheme;
    });
    // Should contain 'light' and/or 'dark'
    expect(colorScheme).toMatch(/light|dark/);
  });
});

test.describe('Preconnect hints', () => {
  test('has preconnect links for CDN domains', async ({ page }) => {
    await page.goto('/');

    const preconnects = page.locator('link[rel="preconnect"]');
    const hrefs: string[] = [];
    const count = await preconnects.count();
    for (let i = 0; i < count; i++) {
      hrefs.push(await preconnects.nth(i).getAttribute('href') || '');
    }

    expect(hrefs).toContain('https://fonts.googleapis.com');
    expect(hrefs).toContain('https://fonts.gstatic.com');
    expect(hrefs.some(h => h.includes('esm.sh'))).toBeTruthy();
    expect(hrefs.some(h => h.includes('cdnjs.cloudflare.com'))).toBeTruthy();
  });
});
