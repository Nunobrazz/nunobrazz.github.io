import { test, expect } from '@playwright/test';

/* ==========================================================================
   SIDEBAR TESTS
   Verifies the author profile sidebar renders correctly and the
   avatar lightbox opens/closes properly.
   ========================================================================== */

test.describe('Sidebar - author profile', () => {
  test('sidebar shows author name and bio', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.author__name')).toContainText('Nuno Braz');
    await expect(page.locator('.author__bio')).toContainText('Ph.D.');
  });

  test('sidebar shows avatar image', async ({ page }) => {
    await page.goto('/');

    const avatar = page.locator('.author__avatar img');
    await expect(avatar).toBeVisible();
  });

  test('sidebar shows social links on desktop', async ({ page }) => {
    await page.goto('/');

    // These should be visible on desktop viewport
    await expect(page.locator('.author__urls').locator('text=GitHub')).toBeVisible();
    await expect(page.locator('.author__urls').locator('text=LinkedIn')).toBeVisible();
    await expect(page.locator('.author__urls').locator('text=Email')).toBeVisible();
  });

  test('sidebar has no visible dropdown arrows on desktop', async ({ page }) => {
    await page.goto('/');

    // The ::before / ::after arrows should be hidden on large screens
    const urlsList = page.locator('.author__urls');
    const beforeDisplay = await urlsList.evaluate(el => {
      return getComputedStyle(el, '::before').display;
    });
    expect(beforeDisplay).toBe('none');
  });
});

test.describe('Avatar lightbox', () => {
  test('clicking avatar opens lightbox overlay', async ({ page }) => {
    await page.goto('/');

    const avatar = page.locator('.author__avatar img');
    await avatar.click();

    // Lightbox should appear
    const lightbox = page.locator('.avatar-lightbox');
    await expect(lightbox).toBeVisible();
    await expect(lightbox).toHaveClass(/is-visible/);

    // Lightbox should contain an image
    const lightboxImg = lightbox.locator('img');
    await expect(lightboxImg).toBeVisible();
  });

  test('clicking lightbox overlay closes it', async ({ page }) => {
    await page.goto('/');

    // Open lightbox
    await page.locator('.author__avatar img').click();
    const lightbox = page.locator('.avatar-lightbox');
    await expect(lightbox).toHaveClass(/is-visible/);

    // Click overlay to close
    await lightbox.click();

    // Wait for transition and removal
    await expect(lightbox).not.toBeVisible({ timeout: 2000 });
  });

  test('pressing Escape closes lightbox', async ({ page }) => {
    await page.goto('/');

    // Open lightbox
    await page.locator('.author__avatar img').click();
    const lightbox = page.locator('.avatar-lightbox');
    await expect(lightbox).toHaveClass(/is-visible/);

    // Press Escape
    await page.keyboard.press('Escape');

    // Should close
    await expect(lightbox).not.toBeVisible({ timeout: 2000 });
  });
});
