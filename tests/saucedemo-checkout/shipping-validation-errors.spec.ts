// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { PRODUCTS, SELECTORS } from './fixtures-and-utilities';

test.describe('Shipping Information - Validation & Errors', () => {
  test('Error when First Name is empty', async ({ page }) => {
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

    // Fill only last name and zip code, leave first name empty
    await page.fill(SELECTORS.checkout.step1.lastName, 'Doe');
    await page.fill(SELECTORS.checkout.step1.postalCode, '12345');

    // Click continue without filling first name
    await page.click(SELECTORS.checkout.step1.continueBtn);

    // Wait for error message to appear
    await page.waitForSelector(SELECTORS.errors.container);

    // Verify error message is displayed
    const errorMessage = await page.locator(SELECTORS.errors.container).textContent();
    expect(errorMessage).toContain('First Name');

    // Verify we're still on checkout step 1
    const url = page.url();
    expect(url).toContain('checkout-step-one');
  });

  test('Error when Last Name is empty', async ({ page }) => {
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

    // Fill only first name and zip code, leave last name empty
    await page.fill(SELECTORS.checkout.step1.firstName, 'John');
    await page.fill(SELECTORS.checkout.step1.postalCode, '12345');

    // Click continue without filling last name
    await page.click(SELECTORS.checkout.step1.continueBtn);

    // Wait for error message to appear
    await page.waitForSelector(SELECTORS.errors.container);

    // Verify error message is displayed
    const errorMessage = await page.locator(SELECTORS.errors.container).textContent();
    expect(errorMessage).toContain('Last Name');

    // Verify we're still on checkout step 1
    expect(page.url()).toContain('checkout-step-one');
  });

  test('Error when Postal Code is empty', async ({ page }) => {
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

    // Fill only first and last name, leave postal code empty
    await page.fill(SELECTORS.checkout.step1.firstName, 'John');
    await page.fill(SELECTORS.checkout.step1.lastName, 'Doe');

    // Click continue without filling postal code
    await page.click(SELECTORS.checkout.step1.continueBtn);

    // Wait for error message to appear
    await page.waitForSelector(SELECTORS.errors.container);

    // Verify error message is displayed
    const errorMessage = await page.locator(SELECTORS.errors.container).textContent();
    expect(errorMessage).toContain('Postal Code');

    // Verify we're still on checkout step 1
    expect(page.url()).toContain('checkout-step-one');
  });

  test('Error when all fields are empty', async ({ page }) => {
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

    // Click continue without filling any fields
    await page.click(SELECTORS.checkout.step1.continueBtn);

    // Wait for error message to appear
    await page.waitForSelector(SELECTORS.errors.container);

    // Verify error message is displayed
    const errorMessage = await page.locator(SELECTORS.errors.container).textContent();
    expect(errorMessage).toBeTruthy();

    // Verify multiple errors are shown or single error is shown
    expect(errorMessage).toContain('First Name');

    // Verify we're still on checkout step 1
    expect(page.url()).toContain('checkout-step-one');
  });

  test('Error with only spaces in First Name', async ({ page }) => {
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

    // Fill with spaces in first name
    await page.fill(SELECTORS.checkout.step1.firstName, '    ');
    await page.fill(SELECTORS.checkout.step1.lastName, 'Doe');
    await page.fill(SELECTORS.checkout.step1.postalCode, '12345');

    // Click continue
    await page.click(SELECTORS.checkout.step1.continueBtn);

    // Wait for error message to appear
    await page.waitForSelector(SELECTORS.errors.container);

    // Verify validation fails for whitespace-only first name
    const errorMessage = await page.locator(SELECTORS.errors.container).textContent();
    expect(errorMessage).toBeTruthy();

    // Verify we're still on checkout step 1
    expect(page.url()).toContain('checkout-step-one');
  });
});
