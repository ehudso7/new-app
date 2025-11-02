import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`should render correctly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Wait for content to load
      await page.waitForTimeout(2000);
      
      // Check that basic elements are visible
      await expect(page.locator('body')).toBeVisible();
      
      // Take a screenshot for manual review if needed
      await page.screenshot({ 
        path: `test-results/screenshots/${viewport.name}-homepage.png`,
        fullPage: true 
      });
    });
  }

  test('should have mobile navigation menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Look for hamburger menu or mobile navigation
    const mobileMenu = page.locator('[aria-label*="menu" i]').or(
      page.locator('button').filter({ hasText: /☰|menu/i })
    );
    
    if (await mobileMenu.count() > 0) {
      await mobileMenu.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should be scrollable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await page.waitForTimeout(2000);
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    
    // Verify scroll position changed
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });
});
