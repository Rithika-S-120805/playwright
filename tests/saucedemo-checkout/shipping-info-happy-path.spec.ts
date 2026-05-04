// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { PRODUCTS, SELECTORS } from './fixtures-and-utilities';

test.describe('Shipping Information - Happy Path', () => {
  test('Enter complete shipping information', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com');

    // Login
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');

    // Wait for products page
    await page.waitForURL('**/inventory.html');

    // Add item to cart
    await page.click(PRODUCTS.backpack.selector);

    // Navigate to cart
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');
    await page.waitForLoadState('networkidle');

    // Click checkout button
    await page.waitForSelector(SELECTORS.cart.checkoutBtn, { timeout: 10000 });
    const checkoutBtn = page.locator(SELECTORS.cart.checkoutBtn);
    await checkoutBtn.waitFor({ state: 'visible', timeout: 10000 });
    await checkoutBtn.click();
    await page.waitForURL('**/checkout-step-one.html');
    await page.waitForSelector(SELECTORS.checkout.step1.firstName);

    // Fill shipping information
    await page.fill(SELECTORS.checkout.step1.firstName, 'John');
    await page.fill(SELECTORS.checkout.step1.lastName, 'Doe');
    await page.fill(SELECTORS.checkout.step1.postalCode, '12345');

    // Verify fields are populated
    expect(await page.inputValue(SELECTORS.checkout.step1.firstName)).toBe('John');
    expect(await page.inputValue(SELECTORS.checkout.step1.lastName)).toBe('Doe');
    expect(await page.inputValue(SELECTORS.checkout.step1.postalCode)).toBe('12345');

    // Click continue button
    await page.click(SELECTORS.checkout.step1.continueBtn);

    // Wait for checkout step 2
    await page.waitForURL('**/checkout-step-two.html');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector(SELECTORS.checkout.step2.container);

    // Verify we're on the order summary page
    const url = page.url();
    expect(url).toContain('checkout-step-two');
  });

  test('Shipping info with special characters in name', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com');

    // Login
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');

    // Wait for products page
    await page.waitForURL('**/inventory.html');

    // Add item to cart
    await page.click(PRODUCTS.backpack.selector);

    // Navigate to checkout
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');
    await page.waitForLoadState('networkidle');
    
    // Wait for and click checkout button
    await page.waitForSelector(SELECTORS.cart.checkoutBtn, { timeout: 10000 });
    const checkoutBtn2 = page.locator(SELECTORS.cart.checkoutBtn);
    await checkoutBtn2.waitFor({ state: 'visible', timeout: 10000 });
    await checkoutBtn2.click();
    await page.waitForURL('**/checkout-step-one.html');

    // Fill shipping info with special characters
    await page.fill(SELECTORS.checkout.step1.firstName, 'Jean-Pierre');
    await page.fill(SELECTORS.checkout.step1.lastName, "O'Connor");
    await page.fill(SELECTORS.checkout.step1.postalCode, '90210');

    // Verify special characters are accepted
    expect(await page.inputValue(SELECTORS.checkout.step1.firstName)).toBe('Jean-Pierre');
    expect(await page.inputValue(SELECTORS.checkout.step1.lastName)).toBe("O'Connor");

    // Click continue
    await page.click(SELECTORS.checkout.step1.continueBtn);

    // Verify navigation to step 2
    await page.waitForURL('**/checkout-step-two.html');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('checkout-step-two');
  });

  test('Shipping info with international zip formats', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com');

    // Login
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');

    // Wait for products page
    await page.waitForURL('**/inventory.html');

    // Add item to cart
    await page.click(PRODUCTS.backpack.selector);

    // Navigate to checkout
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');
    await page.waitForLoadState('networkidle');
    
    // Wait for and click checkout button
    await page.waitForSelector(SELECTORS.cart.checkoutBtn, { timeout: 10000 });
    const checkoutBtn3 = page.locator(SELECTORS.cart.checkoutBtn);
    await checkoutBtn3.waitFor({ state: 'visible', timeout: 10000 });
    await checkoutBtn3.click();
    await page.waitForURL('**/checkout-step-one.html');

    // Fill shipping info with international postal code format
    await page.fill(SELECTORS.checkout.step1.firstName, 'Anna');
    await page.fill(SELECTORS.checkout.step1.lastName, 'Schmidt');
    await page.fill(SELECTORS.checkout.step1.postalCode, 'SW1A 2AA'); // UK postal code format

    // Verify international format is accepted
    expect(await page.inputValue(SELECTORS.checkout.step1.postalCode)).toBe('SW1A 2AA');

    // Click continue
    await page.click(SELECTORS.checkout.step1.continueBtn);

    // Verify form validates and navigates to step 2
    await page.waitForURL('**/checkout-step-two.html');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('checkout-step-two');
  });
});
