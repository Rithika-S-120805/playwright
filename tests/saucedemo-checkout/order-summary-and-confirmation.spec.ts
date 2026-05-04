// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { PRODUCTS, SELECTORS } from './fixtures-and-utilities';

test.describe('Order Summary and Confirmation', () => {
  test('Review order summary on checkout step 2', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com');

    // Login
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');

    // Wait for products page
    await page.waitForURL('**/inventory.html');

    // Add items to cart
    // Backpack - $29.99
    await page.click(PRODUCTS.backpack.selector);
    // Bike Light - $9.99
    await page.click(PRODUCTS.bikeLight.selector);

    // Navigate to cart
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');

    // Click checkout
    await page.click(SELECTORS.cart.checkoutBtn);
    await page.waitForURL('**/checkout-step-one.html');

    // Fill shipping information
    await page.fill(SELECTORS.checkout.step1.firstName, 'John');
    await page.fill(SELECTORS.checkout.step1.lastName, 'Doe');
    await page.fill(SELECTORS.checkout.step1.postalCode, '12345');

    // Click continue to go to step 2
    await page.click(SELECTORS.checkout.step1.continueBtn);
    await page.waitForURL('**/checkout-step-two.html');

    // Verify we're on checkout step 2
    expect(page.url()).toContain('checkout-step-two');

    // Wait for order summary to load
    await page.waitForSelector(SELECTORS.checkout.step2.container);

    // Verify all items are listed
    const itemNames = await page.locator('.checkout_info .inventory_item_name').allTextContents();
    expect(itemNames).toContain('Sauce Labs Backpack');
    expect(itemNames).toContain('Sauce Labs Bike Light');

    // Verify prices are displayed
    const prices = await page.locator('.checkout_info .inventory_item_price').allTextContents();
    expect(prices.length).toBeGreaterThanOrEqual(2);

    // Verify subtotal
    const subtotalText = await page.locator(SELECTORS.checkout.step2.subtotal).textContent();
    expect(subtotalText).toContain('39.98'); // $29.99 + $9.99

    // Verify tax is displayed
    const taxText = await page.locator(SELECTORS.checkout.step2.tax).textContent();
    expect(taxText).toBeTruthy();

    // Verify total is displayed
    const totalText = await page.locator(SELECTORS.checkout.step2.total).textContent();
    expect(totalText).toBeTruthy();
  });

  test('Order summary with single item', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com');

    // Login
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');

    // Wait for products page
    await page.waitForURL('**/inventory.html');

    // Add single item
    await page.click(PRODUCTS.testAllTheThings.selector);

    // Navigate to cart
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');

    // Click checkout
    await page.click(SELECTORS.cart.checkoutBtn);
    await page.waitForURL('**/checkout-step-one.html');

    // Fill shipping information
    await page.fill(SELECTORS.checkout.step1.firstName, 'Jane');
    await page.fill(SELECTORS.checkout.step1.lastName, 'Smith');
    await page.fill(SELECTORS.checkout.step1.postalCode, '54321');

    // Click continue
    await page.click(SELECTORS.checkout.step1.continueBtn);
    await page.waitForURL('**/checkout-step-two.html');

    // Verify single item is displayed
    const cartItems = await page.locator('.cart_item').count();
    expect(cartItems).toBe(1);

    // Verify item name
    const itemName = await page.locator('.checkout_info .inventory_item_name').first().textContent();
    expect(itemName).toContain('Test.allTheThings() T-Shirt');

    // Verify price and quantity
    const price = await page.locator('.checkout_info .inventory_item_price').first().textContent();
    expect(price).toContain('15.99');
  });

  test('Complete purchase and see confirmation', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com');

    // Login
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');

    // Wait for products page
    await page.waitForURL('**/inventory.html');

    // Add items to cart
    await page.click(PRODUCTS.backpack.selector);
    await page.click(PRODUCTS.bikeLight.selector);

    // Navigate to cart
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');

    // Click checkout
    await page.click(SELECTORS.cart.checkoutBtn);
    await page.waitForURL('**/checkout-step-one.html');

    // Fill shipping information
    await page.fill(SELECTORS.checkout.step1.firstName, 'John');
    await page.fill(SELECTORS.checkout.step1.lastName, 'Doe');
    await page.fill(SELECTORS.checkout.step1.postalCode, '12345');

    // Continue to order summary
    await page.click(SELECTORS.checkout.step1.continueBtn);
    await page.waitForURL('**/checkout-step-two.html');

    // Verify we're on order summary page
    await page.waitForSelector(SELECTORS.checkout.step2.container);

    // Click finish button to complete purchase
    await page.click(SELECTORS.checkout.step2.finishBtn);

    // Wait for confirmation page to load
    await page.waitForURL('**/checkout-complete.html');
    await page.waitForSelector(SELECTORS.checkout.complete.header);

    // Verify confirmation page URL
    expect(page.url()).toContain('checkout-complete');

    // Verify confirmation message
    const confirmationHeader = await page.locator(SELECTORS.checkout.complete.header).textContent();
    expect(confirmationHeader).toContain('Thank you');

    // Verify confirmation text
    const confirmationText = await page.locator(SELECTORS.checkout.complete.text).textContent();
    expect(confirmationText).toBeTruthy();

    // Verify back home button is present
    const backHomeButton = await page.locator(SELECTORS.checkout.complete.backHomeBtn).isVisible();
    expect(backHomeButton).toBe(true);
  });

  test('Order confirmation page elements', async ({ page }) => {
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

    // Verify all confirmation elements
    expect(await page.locator(SELECTORS.checkout.complete.container).isVisible()).toBe(true);
    expect(await page.locator(SELECTORS.checkout.complete.header).isVisible()).toBe(true);
    expect(await page.locator(SELECTORS.checkout.complete.text).isVisible()).toBe(true);

    // Verify thank you message
    const headerText = await page.locator(SELECTORS.checkout.complete.header).textContent();
    expect(headerText?.toLowerCase()).toContain('thank you');

    // Verify back home button
    expect(await page.locator(SELECTORS.checkout.complete.backHomeBtn).isVisible()).toBe(true);
  });
});
