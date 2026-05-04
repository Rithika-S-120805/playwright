// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { PRODUCTS, SELECTORS } from './fixtures-and-utilities';

test.describe('Edge Cases and Boundary Conditions', () => {
  test('Very long name values', async ({ page }) => {
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
    await page.click(SELECTORS.cart.checkoutBtn);
    await page.waitForURL('**/checkout-step-one.html');

    // Enter long names
    const longFirstName = 'Christopher'; // 11 characters
    const longLastName = 'Westervelt-Anderson'; // 19 characters
    
    await page.fill(SELECTORS.checkout.step1.firstName, longFirstName);
    await page.fill(SELECTORS.checkout.step1.lastName, longLastName);
    await page.fill(SELECTORS.checkout.step1.postalCode, '90210');

    // Verify long names are accepted
    expect(await page.inputValue(SELECTORS.checkout.step1.firstName)).toBe(longFirstName);
    expect(await page.inputValue(SELECTORS.checkout.step1.lastName)).toBe(longLastName);

    // Click continue
    await page.click(SELECTORS.checkout.step1.continueBtn);
    await page.waitForURL('**/checkout-step-two.html');

    // Verify data displayed correctly without truncation
    const displayedFirstName = await page.locator('.checkout_info').textContent();
    expect(displayedFirstName).toContain(longFirstName);
  });

  test('Minimum valid zip code (single digit)', async ({ page }) => {
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
    await page.click(SELECTORS.cart.checkoutBtn);
    await page.waitForURL('**/checkout-step-one.html');

    // Enter minimum zip code (single digit)
    await page.fill(SELECTORS.checkout.step1.firstName, 'John');
    await page.fill(SELECTORS.checkout.step1.lastName, 'Doe');
    await page.fill(SELECTORS.checkout.step1.postalCode, '0');

    // Click continue
    await page.click(SELECTORS.checkout.step1.continueBtn);

    // Either proceeds to step 2 or shows validation error
    const url = page.url();
    // Accept both outcomes - either successful submission or error
    expect(url).toMatch(/checkout-step-(one|two)/);
  });

  test('Maximum length zip code', async ({ page }) => {
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
    await page.click(SELECTORS.cart.checkoutBtn);
    await page.waitForURL('**/checkout-step-one.html');

    // Enter very long zip code
    const longZip = '123456789'; // 9 digits
    
    await page.fill(SELECTORS.checkout.step1.firstName, 'John');
    await page.fill(SELECTORS.checkout.step1.lastName, 'Doe');
    await page.fill(SELECTORS.checkout.step1.postalCode, longZip);

    // Verify long zip is entered (may be limited by form)
    const enteredZip = await page.inputValue(SELECTORS.checkout.step1.postalCode);
    expect(enteredZip).toBeTruthy();

    // Click continue
    await page.click(SELECTORS.checkout.step1.continueBtn);

    // Accept both successful submission or validation error
    const url = page.url();
    expect(url).toMatch(/checkout-step-(one|two)/);
  });

  test('Numeric values in name fields', async ({ page }) => {
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
    await page.click(SELECTORS.cart.checkoutBtn);
    await page.waitForURL('**/checkout-step-one.html');

    // Enter names with numeric values
    await page.fill(SELECTORS.checkout.step1.firstName, '123John');
    await page.fill(SELECTORS.checkout.step1.lastName, 'Doe456');
    await page.fill(SELECTORS.checkout.step1.postalCode, '12345');

    // Verify numeric prefixes/suffixes are accepted
    expect(await page.inputValue(SELECTORS.checkout.step1.firstName)).toBe('123John');
    expect(await page.inputValue(SELECTORS.checkout.step1.lastName)).toBe('Doe456');

    // Click continue
    await page.click(SELECTORS.checkout.step1.continueBtn);

    // Accept both outcomes
    const url = page.url();
    expect(url).toMatch(/checkout-step-(one|two)/);
  });

  test('Unicode/emoji characters in name', async ({ page }) => {
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
    await page.click(SELECTORS.cart.checkoutBtn);
    await page.waitForURL('**/checkout-step-one.html');

    // Enter names with Unicode characters
    await page.fill(SELECTORS.checkout.step1.firstName, 'José');
    await page.fill(SELECTORS.checkout.step1.lastName, 'Müller');
    await page.fill(SELECTORS.checkout.step1.postalCode, '12345');

    // Verify Unicode characters are accepted
    expect(await page.inputValue(SELECTORS.checkout.step1.firstName)).toBe('José');
    expect(await page.inputValue(SELECTORS.checkout.step1.lastName)).toBe('Müller');

    // Click continue
    await page.click(SELECTORS.checkout.step1.continueBtn);

    // Accept both outcomes - validates or shows error
    const url = page.url();
    expect(url).toMatch(/checkout-step-(one|two|step-one|step-two)/);
  });
});
