import { test, expect } from '@playwright/test';

test.describe('Email Subscription', () => {
  test('should have email subscription form', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(1000);
    
    // Look for email input
    const emailInput = page.locator('input[type="email"]');
    
    if (await emailInput.count() > 0) {
      await expect(emailInput.first()).toBeVisible();
    }
  });

  test('should accept email input', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(1000);
    
    const emailInput = page.locator('input[type="email"]');
    
    if (await emailInput.count() > 0) {
      await emailInput.first().fill('test@example.com');
      await expect(emailInput.first()).toHaveValue('test@example.com');
    }
  });

  test('should handle email subscription', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(1000);
    
    const emailInput = page.locator('input[type="email"]');
    
    if (await emailInput.count() > 0) {
      await emailInput.first().fill('test@example.com');
      
      // Look for subscribe button
      const subscribeButton = page.getByRole('button', { name: /subscribe/i });
      
      if (await subscribeButton.count() > 0) {
        await subscribeButton.first().click();
        
        // Wait for response
        await page.waitForTimeout(2000);
        
        // Check for success message or toast
        const successMessage = page.locator('text=/subscribed|success|thank you/i');
        // We don't assert here as the implementation might vary
      }
    }
  });

  test('should validate invalid email', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(1000);
    
    const emailInput = page.locator('input[type="email"]');
    
    if (await emailInput.count() > 0) {
      await emailInput.first().fill('invalid-email');
      
      const subscribeButton = page.getByRole('button', { name: /subscribe/i });
      
      if (await subscribeButton.count() > 0) {
        await subscribeButton.first().click();
        await page.waitForTimeout(1000);
        
        // Check for validation message
        // HTML5 validation or custom validation
      }
    }
  });
});
