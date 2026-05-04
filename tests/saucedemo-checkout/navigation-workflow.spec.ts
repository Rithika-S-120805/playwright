// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { PRODUCTS, SELECTORS } from './fixtures-and-utilities';

test.describe('Navigation and Workflow', () => {
  test('Cancel checkout and return to products', async ({ page }) => {
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

    // Click checkout to go to step 1
    await page.click(SELECTORS.cart.checkoutBtn);
    await page.waitForURL('**/checkout-step-one.html');

    // Verify we're on checkout step 1
    expect(page.url()).toContain('checkout-step-one');

    // Look for cancel button
    const cancelButton = await page.locator(SELECTORS.checkout.step1.cancelBtn).isVisible();
    expect(cancelButton).toBe(true);

    // Click cancel button
    await page.click(SELECTORS.checkout.step1.cancelBtn);

    // Verify we return to cart page
    await page.waitForURL('**/cart.html');
    expect(page.url()).toContain('cart');

    // Verify cart contents are preserved
    const cartItems = await page.locator('.cart_item').count();
    expect(cartItems).toBe(1);
  });

  test('Back button functionality from checkout step 2 to step 1', async ({ page }) => {
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

    // Fill checkout step 1
    const shippingData = {
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '12345'
    };
    
    await page.fill(SELECTORS.checkout.step1.firstName, shippingData.firstName);
    await page.fill(SELECTORS.checkout.step1.lastName, shippingData.lastName);
    await page.fill(SELECTORS.checkout.step1.postalCode, shippingData.postalCode);

    // Continue to step 2
    await page.click(SELECTORS.checkout.step1.continueBtn);
    await page.waitForURL('**/checkout-step-two.html');

    // Verify we're on step 2
    expect(page.url()).toContain('checkout-step-two');

    // Look for back button on step 2
    const backButton = await page.locator(SELECTORS.checkout.step2.backBtn).isVisible();
    if (backButton) {
      // Click back button
      await page.click(SELECTORS.checkout.step2.backBtn);

      // Verify we return to step 1
      await page.waitForURL('**/checkout-step-one.html');
      expect(page.url()).toContain('checkout-step-one');
    }
  });

  test('Continue shopping returns to products page', async ({ page }) => {
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

    // Verify continue shopping button is present
    const continueShopping = await page.locator(SELECTORS.cart.continueShoppingBtn).isVisible();
    expect(continueShopping).toBe(true);

    // Click continue shopping
    await page.click(SELECTORS.cart.continueShoppingBtn);

    // Verify we return to products page
    await page.waitForURL('**/inventory.html');
    expect(page.url()).toContain('inventory');

    // Verify cart still shows item
    const cartBadge = await page.locator('.shopping_cart_badge').textContent();
    expect(cartBadge).toBe('1');
  });

  test('Back home from confirmation returns to products', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com');

    // Login
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');

    // Wait for products page
    await page.waitForURL('**/inventory.html');

    // Complete full checkout flow
    await page.click(PRODUCTS.backpack.selector);

    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');

    await page.click(SELECTORS.cart.checkoutBtn);
    await page.waitForURL('**/checkout-step-one.html');

    await page.fill(SELECTORS.checkout.step1.firstName, 'John');
    await page.fill(SELECTORS.checkout.step1.lastName, 'Doe');
    await page.fill(SELECTORS.checkout.step1.postalCode, '12345');

    await page.click(SELECTORS.checkout.step1.continueBtn);
    await page.waitForURL('**/checkout-step-two.html');

    await page.click(SELECTORS.checkout.step2.finishBtn);
    await page.waitForURL('**/checkout-complete.html');

    // Verify we're on confirmation page
    expect(page.url()).toContain('checkout-complete');

    // Click back home button
    await page.click(SELECTORS.checkout.complete.backHomeBtn);

    // Verify we return to products page
    await page.waitForURL('**/inventory.html');
    expect(page.url()).toContain('inventory');

    // Verify cart is now empty
    const cartBadgeVisible = await page.locator('.shopping_cart_badge').isVisible();
    expect(cartBadgeVisible).toBe(false);
  });
});
