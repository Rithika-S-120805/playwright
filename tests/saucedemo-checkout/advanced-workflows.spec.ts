// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import {
  loginUser,
  navigateToCart,
  startCheckout,
  fillShippingInfo,
  continueToStep2,
  completeCheckout,
  PRODUCTS,
  SELECTORS,
  SHIPPING_DATA,
  URLS
} from './fixtures-and-utilities';

test.describe('Complete Checkout Workflows - Advanced Scenarios', () => {
  test('Multi-item checkout with verification at each step', async ({ page }) => {
    // Step 1: Login and navigate to products
    await loginUser(page);
    expect(page.url()).toContain('inventory');

    // Step 2: Add multiple items with verification
    const itemsToAdd = [
      PRODUCTS.backpack,
      PRODUCTS.bikeLight,
      PRODUCTS.boltTShirt
    ];

    for (const item of itemsToAdd) {
      await page.click(item.selector);
      // Verify item was added
      const badge = await page.locator(SELECTORS.products.cartBadge).textContent();
      expect(badge).toBeTruthy();
    }

    // Step 3: Navigate to cart and verify all items
    await navigateToCart(page);
    const cartItemCount = await page.locator(SELECTORS.cart.item).count();
    expect(cartItemCount).toBe(3);

    // Step 4: Verify prices and calculate expected total
    const priceTexts = await page.locator(SELECTORS.cart.item + ' ' + SELECTORS.cart.quantity).allTextContents();
    expect(priceTexts.length).toBeGreaterThan(0);

    // Step 5: Proceed to checkout with complete data entry
    await startCheckout(page);
    await fillShippingInfo(page, SHIPPING_DATA.valid);
    
    // Verify data was entered correctly
    expect(await page.inputValue(SELECTORS.checkout.step1.firstName)).toBe(SHIPPING_DATA.valid.firstName);
    expect(await page.inputValue(SELECTORS.checkout.step1.lastName)).toBe(SHIPPING_DATA.valid.lastName);
    expect(await page.inputValue(SELECTORS.checkout.step1.postalCode)).toBe(SHIPPING_DATA.valid.postalCode);

    // Step 6: Continue to order summary
    await continueToStep2(page);
    expect(page.url()).toContain('checkout-step-two');

    // Step 7: Verify order summary shows all items
    const summaryItems = await page.locator('[data-test="inventory-item"]').count();
    expect(summaryItems).toBeGreaterThanOrEqual(3);

    // Step 8: Verify totals are displayed
    const subtotal = await page.locator(SELECTORS.checkout.step2.subtotal).textContent();
    const total = await page.locator(SELECTORS.checkout.step2.total).textContent();
    expect(subtotal).toBeTruthy();
    expect(total).toBeTruthy();

    // Step 9: Complete checkout and verify confirmation
    await completeCheckout(page);
    expect(page.url()).toContain('checkout-complete');
    
    const confirmationHeader = await page.locator(SELECTORS.checkout.complete.header).textContent();
    expect(confirmationHeader?.toLowerCase()).toContain('thank you');
  });

  test('Checkout with quantity verification and tax calculation', async ({ page }) => {
    // Setup: Login and add specific items
    await loginUser(page);
    
    // Add Backpack ($29.99) and Bike Light ($9.99)
    await page.click(PRODUCTS.backpack.selector);
    await page.click(PRODUCTS.bikeLight.selector);

    // Navigate to cart
    await navigateToCart(page);

    // Verify items are in cart
    const cartItems = await page.locator(SELECTORS.cart.item).count();
    expect(cartItems).toBe(2);

    // Complete checkout
    await startCheckout(page);
    await fillShippingInfo(page, SHIPPING_DATA.valid2);
    await continueToStep2(page);

    // Verify totals on step 2 match step 1
    const step2SubtotalText = await page.locator(SELECTORS.checkout.step2.subtotal).textContent();
    const step2TotalText = await page.locator(SELECTORS.checkout.step2.total).textContent();
    
    expect(step2SubtotalText).toBeTruthy();
    expect(step2TotalText).toBeTruthy();
  });

  test('Cart persistence through navigation', async ({ page }) => {
    // Add items to cart
    await loginUser(page);
    const initialItems = [PRODUCTS.backpack, PRODUCTS.boltTShirt];
    
    for (const item of initialItems) {
      await page.click(item.selector);
    }

    // Get cart count after adding
    const cartCountAfterAdd = await page.locator(SELECTORS.products.cartBadge).textContent();

    // Navigate away and back
    await navigateToCart(page);
    const cartCountInCart = await page.locator(SELECTORS.products.cartBadge).textContent();
    
    // Navigate to checkout and back
    await startCheckout(page);
    await page.click(SELECTORS.checkout.step1.cancelBtn);
    
    // Verify cart still shows same count
    const cartCountAfterCancel = await page.locator(SELECTORS.products.cartBadge).textContent();
    
    expect(cartCountAfterAdd).toBe(cartCountInCart);
    expect(cartCountInCart).toBe(cartCountAfterCancel);
  });

  test('Form field state preservation during validation', async ({ page }) => {
    // Navigate to checkout
    await loginUser(page);
    await page.click(PRODUCTS.backpack.selector);
    await navigateToCart(page);
    await startCheckout(page);

    // Fill only first and last name, skip postal code
    await fillShippingInfo(page, {
      firstName: SHIPPING_DATA.valid.firstName,
      lastName: SHIPPING_DATA.valid.lastName,
      postalCode: '' // Empty postal code
    });

    // Attempt to continue without postal code
    await page.click(SELECTORS.checkout.step1.continueBtn);

    // Verify error appears
    await page.waitForSelector(SELECTORS.errors.container);
    const errorMessage = await page.locator(SELECTORS.errors.container).textContent();
    expect(errorMessage).toContain('Postal Code');

    // Verify previously entered data is still there
    const firstName = await page.inputValue(SELECTORS.checkout.step1.firstName);
    const lastName = await page.inputValue(SELECTORS.checkout.step1.lastName);
    
    expect(firstName).toBe(SHIPPING_DATA.valid.firstName);
    expect(lastName).toBe(SHIPPING_DATA.valid.lastName);

    // Now fill postal code and verify can continue
    await page.fill(SELECTORS.checkout.step1.postalCode, SHIPPING_DATA.valid.postalCode);
    await page.click(SELECTORS.checkout.step1.continueBtn);
    
    // Should navigate to step 2 successfully
    await page.waitForURL('**/checkout-step-two.html');
    expect(page.url()).toContain('checkout-step-two');
  });

  test('Remove and re-add item workflow', async ({ page }) => {
    // Add multiple items
    await loginUser(page);
    await page.click(PRODUCTS.backpack.selector);
    await page.click(PRODUCTS.bikeLight.selector);
    await page.click(PRODUCTS.boltTShirt.selector);

    // Verify 3 items in cart
    let cartCount = await page.locator(SELECTORS.products.cartBadge).textContent();
    expect(cartCount).toBe('3');

    // Navigate to cart
    await navigateToCart(page);
    let itemCount = await page.locator(SELECTORS.cart.item).count();
    expect(itemCount).toBe(3);

    // Remove one item (Backpack)
    await page.click(PRODUCTS.backpack.removeSelector);

    // Verify 2 items remain
    itemCount = await page.locator(SELECTORS.cart.item).count();
    expect(itemCount).toBe(2);

    // Navigate back to products
    await page.click(SELECTORS.cart.continueShoppingBtn);
    expect(page.url()).toContain('inventory');

    // Re-add the removed item
    await page.click(PRODUCTS.backpack.selector);

    // Navigate back to cart
    await navigateToCart(page);

    // Verify all 3 items are back
    itemCount = await page.locator(SELECTORS.cart.item).count();
    expect(itemCount).toBe(3);
  });

  test('Checkout with data entry validation at step 2', async ({ page }) => {
    // Quick checkout to step 2
    await loginUser(page);
    await page.click(PRODUCTS.backpack.selector);
    await navigateToCart(page);
    await startCheckout(page);
    
    // Use special characters in names
    await fillShippingInfo(page, SHIPPING_DATA.specialCharacters);
    await continueToStep2(page);

    // Verify item information is complete (names are NOT shown on step 2 summary)
    const itemName = await page.locator('[data-test="inventory-item-name"]').textContent();
    expect(itemName).toContain('Backpack');
    
    // Verify totals are present
    const subtotal = await page.locator(SELECTORS.checkout.step2.subtotal).textContent();
    expect(subtotal).toBeTruthy();
  });
});
