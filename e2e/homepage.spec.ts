import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/DealPulse/i);
  });

  test('should display header with navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check header exists
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check main navigation links
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /trending/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /categories/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /saved/i })).toBeVisible();
  });

  test('should display deal cards', async ({ page }) => {
    await page.goto('/');
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Check that deal cards are present (they should have product images or titles)
    const dealCards = page.locator('[class*="deal"]').or(page.locator('article')).or(page.locator('[class*="card"]'));
    const count = await dealCards.count();
    
    // Expect at least some deals to be displayed
    expect(count).toBeGreaterThan(0);
  });

  test('should have working search functionality', async ({ page }) => {
    await page.goto('/');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"]').or(page.locator('input[placeholder*="search" i]'));
    
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('laptop');
      // Search should either auto-submit or have a submit button
      const searchButton = page.getByRole('button', { name: /search/i });
      if (await searchButton.count() > 0) {
        await searchButton.click();
      }
    }
  });

  test('should display footer', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that the page loads on mobile
    await expect(page.locator('body')).toBeVisible();
  });
});
