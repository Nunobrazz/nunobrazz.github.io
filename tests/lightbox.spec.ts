import { test, expect } from '@playwright/test';

/* ==========================================================================
   LIGHTBOX DIALOG TESTS
   Verifies the avatar lightbox has proper dialog semantics, focus
   management, and ARIA attributes.
   ========================================================================== */

test.describe('Lightbox dialog semantics', () => {
  test('lightbox has role=dialog and aria-modal', async ({ page }) => {
    await page.goto('/');

    await page.locator('.author__avatar img').click();

    const lightbox = page.locator('.avatar-lightbox');
    await expect(lightbox).toBeVisible();
    await expect(lightbox).toHaveAttribute('role', 'dialog');
    await expect(lightbox).toHaveAttribute('aria-modal', 'true');
    await expect(lightbox).toHaveAttribute('aria-label', /avatar/i);
  });

  test('lightbox has a close button with aria-label', async ({ page }) => {
    await page.goto('/');

    await page.locator('.author__avatar img').click();

    const closeBtn = page.locator('.avatar-lightbox__close');
    await expect(closeBtn).toBeVisible();
    await expect(closeBtn).toHaveAttribute('aria-label', /close/i);
  });

  test('close button receives focus when lightbox opens', async ({ page }) => {
    await page.goto('/');

    await page.locator('.author__avatar img').click();
    await expect(page.locator('.avatar-lightbox')).toBeVisible();

    // The close button should be focused
    const focusedTag = await page.evaluate(() => document.activeElement?.className);
    expect(focusedTag).toContain('avatar-lightbox__close');
  });

  test('focus returns to avatar area after lightbox closes', async ({ page }) => {
    await page.goto('/');

    const avatar = page.locator('.author__avatar img');
    await avatar.click();

    const lightbox = page.locator('.avatar-lightbox');
    await expect(lightbox).toBeVisible();

    // Close via Escape
    await page.keyboard.press('Escape');
    await expect(lightbox).not.toBeVisible({ timeout: 2000 });

    // Focus should return to the avatar image (which has tabindex="0")
    const focusedEl = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? { tag: el.tagName, className: el.className } : null;
    });
    expect(focusedEl).not.toBeNull();
    // The focused element should be the avatar img or its container
    expect(
      focusedEl!.tag === 'IMG' || focusedEl!.className.includes('author__avatar')
    ).toBeTruthy();
  });

  test('lightbox image has alt text and dimensions', async ({ page }) => {
    await page.goto('/');

    await page.locator('.author__avatar img').click();

    const lightboxImg = page.locator('.avatar-lightbox img');
    await expect(lightboxImg).toBeVisible();

    const alt = await lightboxImg.getAttribute('alt');
    expect(alt).toBeTruthy();

    const width = await lightboxImg.getAttribute('width');
    const height = await lightboxImg.getAttribute('height');
    expect(width).toBeTruthy();
    expect(height).toBeTruthy();
  });

  test('clicking close button closes lightbox', async ({ page }) => {
    await page.goto('/');

    await page.locator('.author__avatar img').click();

    const lightbox = page.locator('.avatar-lightbox');
    await expect(lightbox).toBeVisible();

    // Click the close button
    await page.locator('.avatar-lightbox__close').click();
    await expect(lightbox).not.toBeVisible({ timeout: 2000 });
  });

  test('clicking outside image closes lightbox', async ({ page }) => {
    await page.goto('/');

    await page.locator('.author__avatar img').click();

    const lightbox = page.locator('.avatar-lightbox');
    await expect(lightbox).toHaveClass(/is-visible/);

    // Click the overlay background (not the image)
    await lightbox.click({ position: { x: 10, y: 10 } });
    await expect(lightbox).not.toBeVisible({ timeout: 2000 });
  });

  test('clicking on the image does not close lightbox', async ({ page }) => {
    await page.goto('/');

    await page.locator('.author__avatar img').click();

    const lightbox = page.locator('.avatar-lightbox');
    await expect(lightbox).toHaveClass(/is-visible/);

    // Click directly on the lightbox image
    await page.locator('.avatar-lightbox img').click();

    // Should still be visible
    await expect(lightbox).toHaveClass(/is-visible/);
  });
});
