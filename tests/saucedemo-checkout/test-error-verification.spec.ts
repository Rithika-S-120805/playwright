import { test, expect } from '@playwright/test';

test.describe('Error Verification Tests', () => {
  test('Page loads correctly - verify checkout test setup', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await expect(page).toHaveTitle(/Swag Labs/i);
  });

  test('Login form renders required elements', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
