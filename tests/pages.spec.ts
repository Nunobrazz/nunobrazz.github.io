import { test, expect } from '@playwright/test';

/* ==========================================================================
   PAGE CONTENT TESTS
   Verifies each section renders the expected content when navigated to.
   ========================================================================== */

test.describe('Home page', () => {
  test('renders main content', async ({ page }) => {
    await page.goto('/');

    // Should have the main content area
    await expect(page.locator('#main')).toBeVisible();
  });
});

test.describe('CV page', () => {
  test('renders work experience and education sections', async ({ page }) => {
    await page.goto('/cv/');

    // Work experience
    await expect(page.locator('text=Teaching Assistant')).toBeVisible();
    await expect(page.locator('text=First Stage Researcher')).toBeVisible();

    // Education
    await expect(page.locator('text=PhD in Blockchain')).toBeVisible();
    await expect(page.locator("text=Master's in Computer Science")).toBeVisible();
    await expect(page.locator('text=B.S. in Information Systems')).toBeVisible();
  });

  test('institution links point to correct URLs', async ({ page }) => {
    await page.goto('/cv/');

    // Check that institutions are linked
    const tecnicoLinks = page.locator('.timeline-subtitle a[href="https://tecnico.ulisboa.pt"]');
    expect(await tecnicoLinks.count()).toBeGreaterThan(0);

    const inescLink = page.locator('.timeline-subtitle a[href="https://www.inesc-id.pt"]');
    expect(await inescLink.count()).toBeGreaterThan(0);

    const unlockitLink = page.locator('.timeline-subtitle a[href="https://unlockit.io"]');
    await expect(unlockitLink).toBeVisible();
  });

  test('institution links open in new tab', async ({ page }) => {
    await page.goto('/cv/');

    const tecnicoLink = page.locator('.timeline-subtitle a[href="https://tecnico.ulisboa.pt"]').first();
    const target = await tecnicoLink.getAttribute('target');
    expect(target).toBe('_blank');
  });

  test('skills section is visible', async ({ page }) => {
    await page.goto('/cv/');

    // Check the skills list item specifically
    await expect(page.locator('li', { hasText: 'Languages: Python' })).toBeVisible();
    await expect(page.locator('li', { hasText: 'Domains: Blockchain' })).toBeVisible();
  });
});

test.describe('Projects page', () => {
  const PROJECTS = [
    'DMsim',
    'DAO for Fractionalized Real World Asset Governance',
    'Blockchain Based Property Rental Platform',
  ];

  test('lists all projects', async ({ page }) => {
    await page.goto('/projects/');

    for (const project of PROJECTS) {
      await expect(page.locator('.timeline-title', { hasText: project })).toBeVisible();
    }
  });

  test('project links use relative paths (not absolute URLs)', async ({ page }) => {
    await page.goto('/projects/');

    const links = page.locator('.timeline-title a');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      // Should be relative (starts with /) not absolute (starts with http)
      expect(href).toMatch(/^\//);
      expect(href).not.toMatch(/^https?:\/\//);
    }
  });

  test('clicking a project renders it inline (SPA navigation)', async ({ page }) => {
    await page.goto('/projects/');

    // Click on DMsim
    await page.locator('.timeline-title a', { hasText: 'DMsim' }).click();

    // Should navigate to the project page
    await expect(page).toHaveURL(/\/portfolio\/2026-dmsim\//);

    // Project content should render
    await expect(page.locator('h1', { hasText: 'DMsim' })).toBeVisible();

    // Sidebar should still be present
    await expect(page.locator('.author__name')).toBeVisible();
  });
});

test.describe('Teaching page', () => {
  test('lists teaching positions', async ({ page }) => {
    await page.goto('/teaching/');

    await expect(page.locator('text=Distributed Systems')).toBeVisible();
    await expect(page.locator('text=Network and Computer Security')).toBeVisible();
  });

  test('teaching items have links to detail pages', async ({ page }) => {
    await page.goto('/teaching/');

    const link = page.locator('.timeline-title a', { hasText: 'Distributed Systems' });
    await expect(link).toBeVisible();

    const href = await link.getAttribute('href');
    expect(href).toContain('/teaching/');
  });
});

test.describe('Footprints page', () => {
  test('map container exists and renders SVG', async ({ page }) => {
    await page.goto('/footprints/');

    // Wait for the map to load (d3 fetches data async)
    await page.waitForSelector('#world-map svg', { timeout: 15000 });

    const svg = page.locator('#world-map svg');
    await expect(svg).toBeVisible();
  });

  test('country count is displayed', async ({ page }) => {
    await page.goto('/footprints/');
    await page.waitForSelector('#world-map svg', { timeout: 15000 });

    const count = page.locator('#country-count');
    await expect(count).toBeVisible();

    // Should show a number > 0
    const text = await count.textContent();
    expect(parseInt(text || '0')).toBeGreaterThan(0);
  });

  test('visited countries are rendered on the map', async ({ page }) => {
    await page.goto('/footprints/');
    await page.waitForSelector('#world-map svg', { timeout: 15000 });

    // Wait for countries to be rendered (d3 fetches world atlas data async)
    await page.waitForSelector('#world-map .country', { timeout: 15000 });

    // Check that some countries have the 'visited' class
    const visitedCount = await page.locator('#world-map .country.visited').count();
    expect(visitedCount).toBeGreaterThan(0);
  });
});

test.describe('Services page', () => {
  test('renders service cards', async ({ page }) => {
    await page.goto('/services/');

    await expect(page.locator('text=Static & Personal Webpages')).toBeVisible();
    await expect(page.locator('text=Other Services')).toBeVisible();
  });

  test('Get in Touch button links to email', async ({ page }) => {
    await page.goto('/services/');

    const ctaButton = page.locator('.services-cta__button');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toContainText('Get in Touch');

    const href = await ctaButton.getAttribute('href');
    expect(href).toMatch(/^mailto:/);
  });

  test('section title shows "Services" not "Web Development Services"', async ({ page }) => {
    await page.goto('/services/');

    const title = page.locator('#masthead-section-title');
    await expect(title).toHaveText('Services');
  });
});
