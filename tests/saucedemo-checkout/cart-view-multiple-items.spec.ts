// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { PRODUCTS, SELECTORS, URLS } from './fixtures-and-utilities';

test.describe('Cart View and Navigation', () => {
  test('View shopping cart with multiple items', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com');

    // Login with standard_user credentials
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');

    // Wait for products page to load
    await page.waitForURL('**/inventory.html');
    await page.waitForSelector('.inventory_list');

    // Add first item: Sauce Labs Backpack
    await page.click(PRODUCTS.backpack.selector);
    await page.waitForSelector('.shopping_cart_badge');

    // Verify cart count is 1
    let cartCount = await page.locator('.shopping_cart_badge').textContent();
    expect(cartCount).toBe('1');

    // Add second item: Sauce Labs Bike Light
    await page.click(PRODUCTS.bikeLight.selector);

    // Verify cart count is 2
    cartCount = await page.locator('.shopping_cart_badge').textContent();
    expect(cartCount).toBe('2');

    // Click shopping cart icon to navigate to cart page
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');
    await page.waitForSelector('.cart_list');

    // Verify both items are visible in cart
    const cartItems = await page.locator('.cart_item').count();
    expect(cartItems).toBe(2);

    // Verify item names
    const itemNames = await page.locator('.inventory_item_name').allTextContents();
    expect(itemNames).toContain('Sauce Labs Backpack');
    expect(itemNames).toContain('Sauce Labs Bike Light');

    // Verify quantities
    const quantities = await page.locator('.cart_quantity').allTextContents();
    quantities.forEach(qty => {
      expect(qty.trim()).toBe('1');
    });

    // Verify prices are displayed
    const prices = await page.locator('.inventory_item_price').allTextContents();
    expect(prices.length).toBeGreaterThan(0);
    prices.forEach(price => {
      expect(price).toMatch(/\$\d+\.\d{2}/);
    });
  });

  test('View cart with single item', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com');

    // Login
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');

    // Wait for products page
    await page.waitForURL('**/inventory.html');

    // Add only one item: Test.allTheThings() T-Shirt
    await page.click(PRODUCTS.testAllTheThings.selector);
    await page.waitForSelector('.shopping_cart_badge');

    // Navigate to cart
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');

    // Verify single item in cart
    const cartItems = await page.locator('.cart_item').count();
    expect(cartItems).toBe(1);

    // Verify quantity is 1
    const quantity = await page.locator('.cart_quantity').first().textContent();
    expect(quantity?.trim()).toBe('1');
  });

  test('View empty cart', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com');

    // Login
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');

    // Wait for products page
    await page.waitForURL('**/inventory.html');

    // Click shopping cart icon without adding any items
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');

    // Verify empty cart state
    const cartItems = await page.locator('.cart_item').count();
    expect(cartItems).toBe(0);

    // Verify cart badge is not shown or shows empty
    const cartBadge = await page.locator('.shopping_cart_badge').isVisible();
    expect(cartBadge).toBe(false);
  });

  test('Verify cart totals calculation', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com');

    // Login
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');

    // Wait for products page
    await page.waitForURL('**/inventory.html');

    // Add multiple items
    // Backpack - $29.99
    await page.click(PRODUCTS.backpack.selector);
    // Bike Light - $9.99
    await page.click(PRODUCTS.bikeLight.selector);
    // Bolt T-Shirt - $15.99
    await page.click(PRODUCTS.boltTShirt.selector);

    // Navigate to cart
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');

    // Verify subtotal
    const subtotalText = await page.locator('.summary_subtotal_label').textContent();
    const subtotalMatch = subtotalText?.match(/[\d.]+/);
    const subtotal = parseFloat(subtotalMatch?.[0] || '0');
    expect(subtotal).toBeCloseTo(55.97, 1); // $29.99 + $9.99 + $15.99

    // Verify total is calculated
    const totalText = await page.locator('.summary_total_label').textContent();
    expect(totalText).toBeTruthy();
  });

  test('Remove item from cart', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://www.saucedemo.com');

    // Login
    await page.fill('input[data-test="username"]', 'standard_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');

    // Wait for products page
    await page.waitForURL('**/inventory.html');

    // Add 2 items
    await page.click(PRODUCTS.backpack.selector);
    await page.click(PRODUCTS.bikeLight.selector);

    // Navigate to cart
    await page.click('.shopping_cart_link');
    await page.waitForURL('**/cart.html');

    // Verify 2 items in cart
    let cartItems = await page.locator('.cart_item').count();
    expect(cartItems).toBe(2);

    // Remove first item
    await page.click(PRODUCTS.backpack.removeSelector);

    // Verify only 1 item remains
    cartItems = await page.locator('.cart_item').count();
    expect(cartItems).toBe(1);

    // Verify remaining item is Bike Light
    const remainingItemName = await page.locator('.inventory_item_name').first().textContent();
    expect(remainingItemName).toContain('Bike Light');
  });
});
