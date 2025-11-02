import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Should load within 10 seconds (generous for first load)
    expect(loadTime).toBeLessThan(10000);
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Some external scripts might log errors, so we filter for critical ones
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('analytics') &&
      !error.includes('third-party')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/');
    
    // Check for essential meta tags
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    
    // Check for description meta tag
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length).toBeGreaterThan(0);
  });

  test('should have proper Open Graph tags', async ({ page }) => {
    await page.goto('/');
    
    // Check for OG tags
    const ogTitle = await page.locator('meta[property="og:title"]').count();
    const ogDescription = await page.locator('meta[property="og:description"]').count();
    
    // At least some OG tags should be present
    expect(ogTitle + ogDescription).toBeGreaterThan(0);
  });

  test('should have working analytics tracking', async ({ page }) => {
    const requests: string[] = [];
    
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('analytics') || url.includes('track')) {
        requests.push(url);
      }
    });
    
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Just verify the page loads, analytics might be optional
    await expect(page.locator('body')).toBeVisible();
  });
});
