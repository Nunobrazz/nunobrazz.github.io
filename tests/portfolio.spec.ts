import { test, expect } from '@playwright/test';

test('DMsim portfolio project is visible', async ({ page }) => {
    await page.goto('/projects/');

    // Verify the project title is present
    const dmsimLink = page.locator('a', { hasText: 'DMsim — Decision Making Simulator' });
    await expect(dmsimLink).toBeVisible();

    // Navigate to the project page
    await dmsimLink.click();

    // Verify project page content
    await expect(page.locator('h1', { hasText: 'DMsim — Decision Making Simulator' })).toBeVisible();
    await expect(page.locator('text=🏦 Decision Markets')).toBeVisible();
    await expect(page.locator('text=🗳️ VCG with Rewards (VCGR)')).toBeVisible();
});

test('Monaco is visible in the footprints map', async ({ page }) => {
    await page.goto('/footprints/');

    // The Monaco ISO numeric code is 492
    // We expect the path element for Monaco to have the 'visited' class
    const monacoPath = page.locator('svg .country').filter({ has: page.locator('..') }).locator('path:nth-child(492)'); // Wait, the paths aren't necessarily ordered by ID in the DOM in that way, topological sorting or generic order. But the D3 script adds 'country visited' effectively based on visitedCountries data. 
    // Actually, we can check for the text on hover!
    // We should mock/intercept the hover if needed or just check the count and JS objects
    // It's safer to hover or just wait for map to load and country count to be > 0
    await page.waitForLoadState('networkidle');

    // Check if country count string exists and indicates our added country (the number will be total visited)
    const countElement = page.locator('#country-count');
    await expect(countElement).toBeVisible();

    // Evaluate in page context to check the visitedCountries object from the script
    // Since visitedCountries is inside an IIFE, we can't directly access it.
    // Instead, we will simulate hover over Monaco or check if any element triggers the tooltip.

    // D3 sets __data__ on elements.
    const hasMonaco = await page.evaluate(() => {
        const paths = document.querySelectorAll('.country.visited');
        for (const p of paths) {
            const id = (p as any).__data__?.id;
            if (String(id) === '492') {
                // Simulate mouseenter to test tooltip
                const event = new MouseEvent('mouseenter', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                p.dispatchEvent(event);
                return true;
            }
        }
        return false;
    });

    expect(hasMonaco).toBeTruthy();

    // Verify tooltip text appeared
    const tooltip = page.locator('#map-tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Monaco');
    await expect(tooltip).toContainText('Primero llegó Verstappen');
});
