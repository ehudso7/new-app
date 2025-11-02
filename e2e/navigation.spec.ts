import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to trending page', async ({ page }) => {
    await page.goto('/');
    
    const trendingLink = page.getByRole('link', { name: /trending/i });
    if (await trendingLink.count() > 0) {
      await trendingLink.first().click();
      await expect(page).toHaveURL(/.*trending/);
    }
  });

  test('should navigate to categories page', async ({ page }) => {
    await page.goto('/');
    
    const categoriesLink = page.getByRole('link', { name: /categories/i });
    if (await categoriesLink.count() > 0) {
      await categoriesLink.first().click();
      await expect(page).toHaveURL(/.*categories/);
    }
  });

  test('should navigate to saved deals page', async ({ page }) => {
    await page.goto('/');
    
    const savedLink = page.getByRole('link', { name: /saved/i });
    if (await savedLink.count() > 0) {
      await savedLink.first().click();
      await expect(page).toHaveURL(/.*saved/);
    }
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');
    
    const aboutLink = page.getByRole('link', { name: /about/i });
    if (await aboutLink.count() > 0) {
      await aboutLink.first().click();
      await expect(page).toHaveURL(/.*about/);
    }
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/');
    
    const contactLink = page.getByRole('link', { name: /contact/i });
    if (await contactLink.count() > 0) {
      await contactLink.first().click();
      await expect(page).toHaveURL(/.*contact/);
    }
  });

  test('should navigate to FAQ page', async ({ page }) => {
    await page.goto('/');
    
    const faqLink = page.getByRole('link', { name: /faq/i });
    if (await faqLink.count() > 0) {
      await faqLink.first().click();
      await expect(page).toHaveURL(/.*faq/);
    }
  });

  test('should have working back navigation', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to another page
    const aboutLink = page.getByRole('link', { name: /about/i });
    if (await aboutLink.count() > 0) {
      await aboutLink.first().click();
      await page.waitForURL(/.*about/);
      
      // Go back
      await page.goBack();
      await expect(page).toHaveURL('/');
    }
  });
});
