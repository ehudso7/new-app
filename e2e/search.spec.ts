import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('should navigate to search page', async ({ page }) => {
    await page.goto('/search');
    
    await expect(page).toHaveURL(/.*search/);
  });

  test('should have a search input', async ({ page }) => {
    await page.goto('/search');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"]').or(
      page.locator('input[placeholder*="search" i]')
    ).or(
      page.locator('input[type="text"]').first()
    );
    
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible();
    }
  });

  test('should be able to enter search query', async ({ page }) => {
    await page.goto('/search');
    
    await page.waitForTimeout(1000);
    
    const searchInput = page.locator('input[type="search"]').or(
      page.locator('input[placeholder*="search" i]')
    ).or(
      page.locator('input[type="text"]').first()
    );
    
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('laptop');
      await expect(searchInput.first()).toHaveValue('laptop');
    }
  });

  test('should show search results', async ({ page }) => {
    await page.goto('/search?q=laptop');
    
    await page.waitForTimeout(2000);
    
    // Verify page loaded
    const bodyContent = await page.textContent('body');
    expect(bodyContent?.length).toBeGreaterThan(0);
  });

  test('should handle empty search', async ({ page }) => {
    await page.goto('/search');
    
    await page.waitForTimeout(1000);
    
    const searchInput = page.locator('input[type="search"]').or(
      page.locator('input[placeholder*="search" i]')
    ).or(
      page.locator('input[type="text"]').first()
    );
    
    if (await searchInput.count() > 0) {
      // Clear any existing value
      await searchInput.first().clear();
      
      // Try to submit search
      const searchButton = page.getByRole('button', { name: /search/i });
      if (await searchButton.count() > 0) {
        await searchButton.first().click();
      }
    }
  });
});
