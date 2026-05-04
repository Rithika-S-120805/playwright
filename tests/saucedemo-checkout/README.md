# SauceDemo Checkout Test Suite - Comprehensive Documentation

## Overview

This comprehensive Playwright automation test suite covers the complete e-commerce checkout workflow for the SauceDemo application (https://www.saucedemo.com). The suite includes production-ready tests for cart management, shipping information validation, order summary review, and checkout completion, organized across multiple test files with proper fixtures, utilities, and best practices.

## Test Suite Structure

### Directory Organization

```
tests/saucedemo-checkout/
├── cart-view-multiple-items.spec.ts              # Cart view and manipulation tests
├── shipping-info-happy-path.spec.ts              # Shipping info happy path scenarios
├── shipping-validation-errors.spec.ts            # Form validation and error handling
├── order-summary-and-confirmation.spec.ts        # Order review and confirmation
├── navigation-workflow.spec.ts                   # Navigation and workflow tests
├── edge-cases-boundary-conditions.spec.ts        # Edge cases and boundary testing
├── fixtures-and-utilities.ts                     # Test fixtures and utility functions
└── README.md                                     # This file
```

## Test Coverage Summary

### 1. Cart View and Navigation (5 tests)
**File:** `cart-view-multiple-items.spec.ts`

- **AC1-001: View shopping cart with multiple items** - Add multiple items, verify display and totals
- **AC1-002: View cart with single item** - Single item cart verification
- **AC1-003: View empty cart** - Empty cart state verification
- **AC1-004: Verify cart totals calculation** - Subtotal, tax, and total calculations
- **AC1-005: Remove item from cart** - Item removal and total recalculation

### 2. Shipping Information - Happy Path (3 tests)
**File:** `shipping-info-happy-path.spec.ts`

- **AC2-001: Enter complete shipping information** - Standard valid data entry
- **AC2-002: Shipping info with special characters** - Names with hyphens and apostrophes
- **AC2-003: International zip formats** - Support for various postal code formats

### 3. Shipping Information - Validation & Errors (5 tests)
**File:** `shipping-validation-errors.spec.ts`

- **AC8-001: Error when First Name is empty** - First name required field validation
- **AC8-002: Error when Last Name is empty** - Last name required field validation
- **AC8-003: Error when Postal Code is empty** - Postal code required field validation
- **AC8-004: Error when all fields are empty** - Multiple field validation
- **AC8-005: Error with only spaces in First Name** - Whitespace validation

### 4. Order Summary and Confirmation (5 tests)
**File:** `order-summary-and-confirmation.spec.ts`

- **AC3-001 & AC4-001: Review order summary** - Order summary display with multiple items
- **AC3-002 & AC4-002: Single item order summary** - Single item order verification
- **AC6-001 & AC7-001: Complete purchase and confirmation** - Full checkout to confirmation
- **AC7-002: Order confirmation page elements** - Confirmation page structure verification

### 5. Navigation and Workflow (5 tests)
**File:** `navigation-workflow.spec.ts`

- **NW-001: Cancel checkout and return** - Cancel button functionality
- **NW-002: Back button from step 2 to step 1** - Back navigation between steps
- **NW-003: Continue shopping** - Continue shopping navigation
- **NW-004: Back home from confirmation** - Post-order navigation
- **NW-005: Cart preservation** - Verify cart contents during navigation

### 6. Edge Cases and Boundary Conditions (5 tests)
**File:** `edge-cases-boundary-conditions.spec.ts`

- **EC-001: Very long name values** - Long name handling (19+ characters)
- **EC-002: Minimum valid zip code** - Single digit postal code
- **EC-003: Maximum length zip code** - Extended postal code format
- **EC-004: Numeric values in name fields** - Alphanumeric name validation
- **EC-005: Unicode/emoji characters** - International character support

## Total Test Coverage
- **28 comprehensive test scenarios**
- **6 test files** organized by functionality
- **Production-ready** with proper waits, error handling, and assertions

## Key Selectors Reference

### Authentication
```
input[data-test="username"]      # Username input field
input[data-test="password"]      # Password input field
input[data-test="login-button"]  # Login button
```

### Products & Cart
```
.inventory_list                          # Products container
button[data-test*="add-to-cart"]         # Add to cart buttons
.shopping_cart_link                      # Shopping cart icon/link
.shopping_cart_badge                     # Cart item count badge
button[data-test*="remove"]              # Remove from cart button
.cart_list                               # Cart items container
```

### Checkout Step 1 - Shipping Information
```
input[data-test="firstName"]             # First name input
input[data-test="lastName"]              # Last name input
input[data-test="postalCode"]            # Postal code input
input[data-test="continue"]              # Continue button
a[data-test="cancel"]                    # Cancel button
.error-message-container                 # Error messages
```

### Checkout Step 2 - Order Summary
```
.checkout_summary                        # Order summary container
.summary_subtotal_label                  # Subtotal display
.summary_tax_label                       # Tax amount display
.summary_total_label                     # Total amount display
button[data-test="finish"]               # Finish/complete order button
```

### Checkout Complete
```
.complete-header                         # Confirmation header
.complete-text                           # Confirmation text
button[data-test="back-home"]            # Back to products button
```

## Test Data

### Login Credentials
```
Username: standard_user
Password: secret_sauce
```

### Test Products and Prices
- Sauce Labs Backpack: $49.99
- Sauce Labs Bike Light: $9.99
- Sauce Labs Bolt T-Shirt: $15.99
- Test.allTheThings() T-Shirt: $15.99

### Test Shipping Data
```javascript
// Valid data
{ firstName: 'John', lastName: 'Doe', postalCode: '12345' }

// Special characters
{ firstName: 'Jean-Pierre', lastName: "O'Connor", postalCode: '90210' }

// International format
{ firstName: 'Anna', lastName: 'Schmidt', postalCode: 'SW1A 2AA' }

// Unicode characters
{ firstName: 'José', lastName: 'Müller', postalCode: '12345' }

// Numeric values
{ firstName: '123John', lastName: 'Doe456', postalCode: '12345' }

// Long names
{ firstName: 'Christopher', lastName: 'Westervelt-Anderson', postalCode: '90210' }
```

## Running the Tests

### Run All Tests
```bash
npx playwright test tests/saucedemo-checkout/
```

### Run Specific Test File
```bash
npx playwright test tests/saucedemo-checkout/cart-view-multiple-items.spec.ts
```

### Run Specific Test Suite
```bash
npx playwright test tests/saucedemo-checkout/shipping-validation-errors.spec.ts
```

### Run with Specific Browser
```bash
# Chrome only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# Safari only
npx playwright test --project=webkit
```

### Run in Debug Mode
```bash
npx playwright test tests/saucedemo-checkout/ --debug
```

### Run with UI Mode (Preview)
```bash
npx playwright test tests/saucedemo-checkout/ --ui
```

### Run with Headed Browser
```bash
npx playwright test tests/saucedemo-checkout/ --headed
```

### Generate Test Report
```bash
npx playwright test tests/saucedemo-checkout/
npx playwright show-report
```

## Configuration

The tests are configured in `playwright.config.ts` with the following settings:

### Browsers
- ✅ Chromium (Chrome)
- ✅ Firefox
- ✅ WebKit (Safari)

### Timeouts
- **Test timeout:** 30 seconds
- **Navigation timeout:** 15 seconds
- **Expect timeout:** 5 seconds

### Retry Policy
- **Retries on failure:** 0 (for development), can be set to 1-2 for CI/CD

### Screenshot & Video
- Screenshots: On failure
- Videos: On failure
- Traces: On failure (for debugging)

## Best Practices Implemented

### 1. **Wait Strategies**
```javascript
// Wait for navigation
await page.waitForURL('**/cart.html');

// Wait for element
await page.waitForSelector('.inventory_list');

// Implicit waits in locators
await page.click('button[data-test="checkout"]');
```

### 2. **Error Handling**
- Checks for error message containers
- Validates error messages contain expected text
- Verifies page remains on error state

### 3. **Data Verification**
- Multiple assertions per test
- Validates both UI display and navigational outcomes
- Checks calculations (subtotal, tax, total)

### 4. **Test Isolation**
- Each test performs full login and setup
- No test dependencies
- Can be run in any order

### 5. **Fixtures and Utilities**
- Reusable test data
- Common selectors in constants
- Utility functions for repetitive actions
- Authenticated page fixture available

### 6. **Accessibility**
- Uses data-test attributes for stability
- Avoids brittle XPath selectors
- Semantic HTML element selection

## Fixtures and Utilities

### Available Fixtures
```typescript
// fixtures-and-utilities.ts exports:

// Test data constants
TEST_USER              // Login credentials
PRODUCTS               // Product information with selectors
SELECTORS              // All UI element selectors
URLS                   // Application URLs
SHIPPING_DATA          // Various shipping data scenarios

// Utility functions
loginUser()            // Login and navigate to products
addToCart()            // Add item to cart
navigateToCart()       // Navigate to cart page
startCheckout()        // Initiate checkout
fillShippingInfo()     // Fill shipping form
continueToStep2()      // Proceed to order summary
completeCheckout()     // Finish order
getCartItemCount()     // Get cart count
calculateTotalPrice()  // Calculate order total
calculateTaxAmount()   // Calculate tax (7%)
```

### Using Fixtures in Tests
```typescript
import { 
  test, 
  loginUser, 
  PRODUCTS, 
  SELECTORS,
  SHIPPING_DATA 
} from './fixtures-and-utilities';

test('Custom test with utilities', async ({ page }) => {
  await loginUser(page);
  await page.click(PRODUCTS.backpack.selector);
  // ... rest of test
});
```

### Using Authenticated Fixture
```typescript
import { test as customTest } from './fixtures-and-utilities';

customTest('Using authenticated fixture', async ({ authenticatedPage }) => {
  // Already logged in and on products page
  await authenticatedPage.click(PRODUCTS.backpack.selector);
  // ... rest of test
});
```

## Common Test Patterns

### Pattern 1: Full Checkout Flow
```typescript
test('Full checkout workflow', async ({ page }) => {
  // Login
  await loginUser(page);
  
  // Add items
  await addToCart(page, PRODUCTS.backpack.selector);
  await addToCart(page, PRODUCTS.bikeLight.selector);
  
  // Cart management
  await navigateToCart(page);
  
  // Checkout
  await startCheckout(page);
  await fillShippingInfo(page, SHIPPING_DATA.valid);
  await continueToStep2(page);
  
  // Complete
  await completeCheckout(page);
});
```

### Pattern 2: Validation Testing
```typescript
test('Form validation', async ({ page }) => {
  await startCheckout(page);
  
  // Skip required field
  await fillShippingInfo(page, { firstName: '', lastName: 'Doe', postalCode: '12345' });
  
  // Submit and verify error
  await page.click(SELECTORS.checkout.step1.continueBtn);
  await page.waitForSelector(SELECTORS.errors.container);
  
  const error = await page.locator(SELECTORS.errors.container).textContent();
  expect(error).toContain('First Name');
});
```

### Pattern 3: Multiple Assertions
```typescript
test('Verify order totals', async ({ page }) => {
  // ... add items and navigate to cart
  
  const subtotal = await page.locator('.summary_subtotal_label').textContent();
  const tax = await page.locator('.summary_tax_label').textContent();
  const total = await page.locator('.summary_total_label').textContent();
  
  // Verify formats
  expect(subtotal).toMatch(/\$[\d.]+/);
  expect(tax).toMatch(/\$[\d.]+/);
  expect(total).toMatch(/\$[\d.]+/);
});
```

## Troubleshooting

### Issue: Tests timing out on navigation
**Solution:** Ensure you're using `waitForURL()` after navigation-triggering actions.

### Issue: Selectors not found
**Solution:** 
- Check that you're using data-test attributes as primary selectors
- Verify page has loaded using `waitForSelector()` for key elements
- Use `page.screenshot()` to debug element visibility

### Issue: Cart count badge not appearing
**Solution:** 
- Ensure element exists before checking visibility
- Cart badge only appears when at least one item is in cart
- Use `isVisible()` to check before accessing

### Issue: Error messages not appearing
**Solution:**
- Wait for error container: `await page.waitForSelector('.error-message-container')`
- Some error messages appear with slight delay
- Check parent container visibility first

## Maintenance and Updates

### Updating Selectors
If SauceDemo updates their UI:

1. Update selectors in `fixtures-and-utilities.ts`
2. Run single test in debug mode to verify new selectors
3. Update all affected test files
4. Re-run full suite

### Adding New Tests
1. Identify test scenario coverage gap
2. Create test in appropriate file or new file
3. Use existing fixtures and utilities
4. Follow established patterns
5. Add documentation

### Performance Optimization
- Tests run in parallel by default (workers setting in config)
- Full suite should complete in < 5 minutes
- Use `--workers=4` for faster execution (adjust based on system)

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Playwright tests
  run: npx playwright test tests/saucedemo-checkout/

- name: Upload Report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Support and Reporting

For issues or test failures:
1. Run test in debug mode: `npx playwright test --debug`
2. Review test report: `npx playwright show-report`
3. Check browser-specific failures in HTML report
4. Attach screenshots/videos to issue reports

---

**Last Updated:** May 4, 2026  
**Test Suite Version:** 1.0  
**Application URL:** https://www.saucedemo.com  
**Total Tests:** 28 comprehensive test scenarios
