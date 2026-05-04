// Playwright Test Fixtures and Configuration for SauceDemo Checkout Tests
// This file provides common test data, fixtures, and utilities for the checkout test suite

import { test as base, Page } from '@playwright/test';

// Test credentials
export const TEST_USER = {
  username: 'standard_user',
  password: 'secret_sauce',
  email: 'test@saucedemo.com'
};

// Test data for products
export const PRODUCTS = {
  backpack: {
    name: 'Sauce Labs Backpack',
    price: 29.99,
    selector: 'button[id="add-to-cart-sauce-labs-backpack"]',
    removeSelector: 'button[id="remove-sauce-labs-backpack"]'
  },
  bikeLight: {
    name: 'Sauce Labs Bike Light',
    price: 9.99,
    selector: 'button[id="add-to-cart-sauce-labs-bike-light"]',
    removeSelector: 'button[id="remove-sauce-labs-bike-light"]'
  },
  boltTShirt: {
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99,
    selector: 'button[id="add-to-cart-sauce-labs-bolt-t-shirt"]',
    removeSelector: 'button[id="remove-sauce-labs-bolt-t-shirt"]'
  },
  fleecejacket: {
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99,
    selector: 'button[id="add-to-cart-sauce-labs-fleece-jacket"]',
    removeSelector: 'button[id="remove-sauce-labs-fleece-jacket"]'
  },
  onesie: {
    name: 'Sauce Labs Onesie',
    price: 7.99,
    selector: 'button[id="add-to-cart-sauce-labs-onesie"]',
    removeSelector: 'button[id="remove-sauce-labs-onesie"]'
  },
  testAllTheThings: {
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
    selector: 'button[id="add-to-cart-test.allthethings()-t-shirt-(red)"]',
    removeSelector: 'button[id="remove-test.allthethings()-t-shirt-(red)"]'
  }
};

// Selectors for common elements
export const SELECTORS = {
  login: {
    username: 'input[data-test="username"]',
    password: 'input[data-test="password"]',
    button: 'input[data-test="login-button"]'
  },
  products: {
    container: '.inventory_list',
    item: '.inventory_item',
    name: '.inventory_item_name',
    price: '.inventory_item_price',
    cartBadge: '.shopping_cart_badge',
    cartLink: '.shopping_cart_link'
  },
  cart: {
    container: '.cart_list',
    item: '.cart_item',
    quantity: '.cart_quantity',
    removeBtn: 'button[data-test*="remove"]',
    checkoutBtn: 'a[data-test="checkout"], button:has-text("Checkout")',
    continueShoppingBtn: 'a[data-test="continue-shopping"], button:has-text("Continue Shopping")',
    subtotal: '.summary_subtotal_label',
    total: '.summary_total_label'
  },
  checkout: {
    step1: {
      firstName: 'input[data-test="firstName"]',
      lastName: 'input[data-test="lastName"]',
      postalCode: 'input[data-test="postalCode"]',
      continueBtn: 'input[data-test="continue"], button:has-text("Continue")',
      cancelBtn: 'a[data-test="cancel"], button:has-text("Cancel")'
    },
    step2: {
      container: '#checkout_summary_container, [data-test="checkout-summary-container"]',
      subtotal: '.summary_subtotal_label, [data-test="subtotal-label"]',
      tax: '.summary_tax_label, [data-test="tax-label"]',
      total: '.summary_total_label, [data-test="total-label"]',
      finishBtn: 'button[data-test="finish"], button:has-text("Finish")',
      cancelBtn: 'button[data-test="cancel"], button:has-text("Cancel")',
      backBtn: 'button[data-test="back"], button:has-text("Back")'
    },
    complete: {
      container: '#checkout_complete_container, [data-test="checkout-complete-container"]',
      header: '[data-test="complete-header"]',
      text: '[data-test="complete-text"]',
      backHomeBtn: 'button[data-test="back-home"], button:has-text("Back Home")'
    }
  },
  errors: {
    container: '.error-message-container.error',
    message: '.error-message-container.error h3, .error-message-container.error'
  }
};

// URLs
export const URLS = {
  base: 'https://www.saucedemo.com',
  login: 'https://www.saucedemo.com/',
  products: 'https://www.saucedemo.com/inventory.html',
  cart: 'https://www.saucedemo.com/cart.html',
  checkoutStep1: 'https://www.saucedemo.com/checkout-step-one.html',
  checkoutStep2: 'https://www.saucedemo.com/checkout-step-two.html',
  checkoutComplete: 'https://www.saucedemo.com/checkout-complete.html'
};

// Test data for shipping information
export const SHIPPING_DATA = {
  valid: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345'
  },
  valid2: {
    firstName: 'Jane',
    lastName: 'Smith',
    postalCode: '54321'
  },
  specialCharacters: {
    firstName: 'Jean-Pierre',
    lastName: "O'Connor",
    postalCode: '90210'
  },
  internationalZip: {
    firstName: 'Anna',
    lastName: 'Schmidt',
    postalCode: 'SW1A 2AA'
  },
  longNames: {
    firstName: 'Christopher',
    lastName: 'Westervelt-Anderson',
    postalCode: '90210'
  },
  unicode: {
    firstName: 'José',
    lastName: 'Müller',
    postalCode: '12345'
  },
  numeric: {
    firstName: '123John',
    lastName: 'Doe456',
    postalCode: '12345'
  }
};

// Fixture: Authenticated user context
type AuthFixture = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixture>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login
    await page.goto(URLS.login);

    // Login
    await page.fill(SELECTORS.login.username, TEST_USER.username);
    await page.fill(SELECTORS.login.password, TEST_USER.password);
    await page.click(SELECTORS.login.button);

    // Wait for products page
    await page.waitForURL('**/inventory.html');
    await page.waitForSelector(SELECTORS.products.container);

    // Use the page in tests
    await use(page);

    // Cleanup is handled automatically
  }
});

// Utility functions for common test operations
export async function loginUser(page: Page): Promise<void> {
  await page.goto(URLS.login);
  await page.fill(SELECTORS.login.username, TEST_USER.username);
  await page.fill(SELECTORS.login.password, TEST_USER.password);
  await page.click(SELECTORS.login.button);
  await page.waitForURL('**/inventory.html');
}

export async function addToCart(page: Page, productSelector: string): Promise<void> {
  await page.click(productSelector);
  await page.waitForSelector(SELECTORS.products.cartBadge);
}

export async function navigateToCart(page: Page): Promise<void> {
  await page.click(SELECTORS.products.cartLink);
  await page.waitForURL('**/cart.html');
  await page.waitForSelector(SELECTORS.cart.container);
  await page.waitForSelector(SELECTORS.cart.checkoutBtn);
  await page.waitForLoadState('networkidle');
}

export async function startCheckout(page: Page): Promise<void> {
  await page.waitForSelector(SELECTORS.cart.checkoutBtn, { timeout: 10000 });
  const checkoutBtn = page.locator(SELECTORS.cart.checkoutBtn);
  await checkoutBtn.waitFor({ state: 'visible', timeout: 10000 });
  await checkoutBtn.click();
  await page.waitForURL('**/checkout-step-one.html');
  await page.waitForSelector(SELECTORS.checkout.step1.firstName);
}

export async function fillShippingInfo(
  page: Page,
  data: { firstName: string; lastName: string; postalCode: string }
): Promise<void> {
  await page.fill(SELECTORS.checkout.step1.firstName, data.firstName);
  await page.fill(SELECTORS.checkout.step1.lastName, data.lastName);
  await page.fill(SELECTORS.checkout.step1.postalCode, data.postalCode);
}

export async function continueToStep2(page: Page): Promise<void> {
  const continueBtn = page.locator(SELECTORS.checkout.step1.continueBtn);
  await continueBtn.waitFor({ state: 'visible', timeout: 10000 });
  await continueBtn.click();
  await page.waitForURL('**/checkout-step-two.html');
  await page.waitForLoadState('networkidle');
  // Wait for step 2 container
  await page.waitForSelector('#checkout_summary_container, [data-test="checkout-summary-container"], button[data-test="finish"]', { timeout: 15000 });
}

export async function completeCheckout(page: Page): Promise<void> {
  await page.click(SELECTORS.checkout.step2.finishBtn);
  await page.waitForURL('**/checkout-complete.html');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector(SELECTORS.checkout.complete.header);
}

export async function getCartItemCount(page: Page): Promise<number> {
  const badge = await page.locator(SELECTORS.products.cartBadge).isVisible();
  if (!badge) return 0;
  const count = await page.locator(SELECTORS.products.cartBadge).textContent();
  return parseInt(count || '0', 10);
}

export async function calculateTotalPrice(items: number[]): Promise<number> {
  return items.reduce((sum, price) => sum + price, 0);
}

export async function calculateTaxAmount(subtotal: number, taxRate: number = 0.07): Promise<number> {
  return parseFloat((subtotal * taxRate).toFixed(2));
}

export { expect } from '@playwright/test';
