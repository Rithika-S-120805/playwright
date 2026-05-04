import { test, expect } from '@playwright/test';

test.describe('Error Verification Tests', () => {
  test('Intentional failure - verify GitHub issue creation', async ({ page }) => {
    // This test deliberately fails to verify the GitHub Actions workflow
    // creates issues for failing tests
    
    await page.goto('https://www.saucedemo.com');
    
    // This assertion will fail
    expect(true).toBe(false);
  });
  
  test('Another intentional failure - test error formatting', async ({ page }) => {
    // Second test failure to show multiple issues
    await page.goto('https://www.saucedemo.com');
    
    // This will fail with a clear error
    const nonExistentElement = await page.locator('button.this-does-not-exist').count();
    expect(nonExistentElement).toBe(5);
  });
});
