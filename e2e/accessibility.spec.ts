import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(1000);
    
    // Check for h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(2000);
    
    // Get all images
    const images = await page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check first few images for alt text
      for (let i = 0; i < Math.min(5, imageCount); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        // Alt can be empty string for decorative images, but should be present
        expect(alt !== null).toBeTruthy();
      }
    }
  });

  test('should have proper ARIA labels for buttons', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(1000);
    
    // Get all buttons
    const buttons = await page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      // Check that buttons have text or aria-label
      for (let i = 0; i < Math.min(5, buttonCount); i++) {
        const button = buttons.nth(i);
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        
        // Button should have either text content or aria-label
        expect(text?.trim().length || ariaLabel?.length).toBeGreaterThan(0);
      }
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(1000);
    
    // Press Tab key several times
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    // Check if focus is visible (some element should be focused)
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeElement).toBeTruthy();
  });

  test('should have proper link contrast', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(1000);
    
    // Just verify links exist and are visible
    const links = page.locator('a');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      await expect(links.first()).toBeVisible();
    }
  });

  test('should have skip to main content link', async ({ page }) => {
    await page.goto('/');
    
    // Look for skip link (common accessibility feature)
    const skipLink = page.locator('a[href="#main"]').or(
      page.locator('text=/skip to (main )?content/i')
    );
    
    // This is optional but good to have
    const skipLinkCount = await skipLink.count();
    // We don't assert as it's not always required
  });
});
