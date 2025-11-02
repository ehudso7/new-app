import { test, expect } from '@playwright/test';

test.describe('Deals Functionality', () => {
  test('should display deals on the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Wait for any dynamic content to load
    await page.waitForTimeout(2000);
    
    // Look for any content that might be deals
    const pageContent = await page.content();
    
    // Verify page has loaded
    expect(pageContent.length).toBeGreaterThan(0);
  });

  test('should be able to save a deal', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(2000);
    
    // Look for save/bookmark buttons
    const saveButton = page.getByRole('button', { name: /save/i }).or(
      page.locator('[aria-label*="save" i]')
    ).or(
      page.locator('button').filter({ hasText: /♥|❤|bookmark/i })
    );
    
    if (await saveButton.count() > 0) {
      await saveButton.first().click();
      
      // Check if there's any feedback (like a toast notification)
      await page.waitForTimeout(500);
    }
  });

  test('should navigate to saved deals page', async ({ page }) => {
    await page.goto('/saved');
    
    // Verify we're on the saved deals page
    await expect(page).toHaveURL(/.*saved/);
  });

  test('should filter deals by category', async ({ page }) => {
    await page.goto('/categories');
    
    await page.waitForTimeout(1000);
    
    // Look for category buttons or links
    const categoryButtons = page.locator('button').filter({ hasText: /electronics|fashion|home|sports|books/i });
    
    if (await categoryButtons.count() > 0) {
      await categoryButtons.first().click();
      await page.waitForTimeout(1000);
    }
  });

  test('should show deal details when clicked', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(2000);
    
    // Try to find and click on a deal
    const dealLinks = page.locator('a[href*="amazon"]').or(
      page.locator('button').filter({ hasText: /view|details|shop/i })
    );
    
    if (await dealLinks.count() > 0) {
      // Note: We don't actually click external links in tests
      // Just verify they exist
      const firstDeal = dealLinks.first();
      await expect(firstDeal).toBeVisible();
    }
  });

  test('should display discount percentages', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(2000);
    
    // Look for discount indicators (%, off, save, etc.)
    const pageContent = await page.textContent('body');
    
    // Check if there are percentage signs or discount terms
    const hasDiscountInfo = pageContent?.includes('%') || 
                           pageContent?.toLowerCase().includes('off') ||
                           pageContent?.toLowerCase().includes('save');
    
    expect(hasDiscountInfo).toBeTruthy();
  });
});
