# SauceDemo Checkout Tests - Quick Reference Guide

## 🚀 Quick Start

### Run All Tests
```bash
cd d:\internship\playwright\playwrightagent
npx playwright test tests/saucedemo-checkout/
```

### Run with HTML Report
```bash
npx playwright test tests/saucedemo-checkout/
npx playwright show-report
```

### Run Single Test File
```bash
npx playwright test tests/saucedemo-checkout/cart-view-multiple-items.spec.ts
```

### Run Specific Test by Name
```bash
npx playwright test -g "View shopping cart with multiple items"
```

---

## 🎯 Test Files Overview

### 1. **cart-view-multiple-items.spec.ts** ⭐
**5 tests** - Cart functionality and item management
```bash
npx playwright test tests/saucedemo-checkout/cart-view-multiple-items.spec.ts
```
- ✅ View shopping cart with multiple items
- ✅ View cart with single item
- ✅ View empty cart
- ✅ Verify cart totals calculation
- ✅ Remove item from cart

### 2. **shipping-info-happy-path.spec.ts** ✨
**3 tests** - Valid shipping information entry
```bash
npx playwright test tests/saucedemo-checkout/shipping-info-happy-path.spec.ts
```
- ✅ Enter complete shipping information
- ✅ Shipping info with special characters
- ✅ Shipping info with international zip formats

### 3. **shipping-validation-errors.spec.ts** ⚠️
**5 tests** - Form validation and error handling
```bash
npx playwright test tests/saucedemo-checkout/shipping-validation-errors.spec.ts
```
- ✅ Error when First Name is empty
- ✅ Error when Last Name is empty
- ✅ Error when Postal Code is empty
- ✅ Error when all fields are empty
- ✅ Error with only spaces in First Name

### 4. **order-summary-and-confirmation.spec.ts** 📦
**5 tests** - Order review and confirmation
```bash
npx playwright test tests/saucedemo-checkout/order-summary-and-confirmation.spec.ts
```
- ✅ Review order summary on checkout step 2
- ✅ Order summary with single item
- ✅ Complete purchase and see confirmation
- ✅ Order confirmation page elements

### 5. **navigation-workflow.spec.ts** 🔄
**5 tests** - Navigation between workflow steps
```bash
npx playwright test tests/saucedemo-checkout/navigation-workflow.spec.ts
```
- ✅ Cancel checkout and return to products
- ✅ Back button functionality from checkout step 2 to step 1
- ✅ Continue shopping returns to products page
- ✅ Back home from confirmation returns to products
- ✅ Cart preservation through navigation

### 6. **edge-cases-boundary-conditions.spec.ts** 🔍
**5 tests** - Edge cases and boundary testing
```bash
npx playwright test tests/saucedemo-checkout/edge-cases-boundary-conditions.spec.ts
```
- ✅ Very long name values
- ✅ Minimum valid zip code (single digit)
- ✅ Maximum length zip code
- ✅ Numeric values in name fields
- ✅ Unicode/emoji characters in name

### 7. **advanced-workflows.spec.ts** 🎓
**5 tests** - Complex scenarios with multiple assertions
```bash
npx playwright test tests/saucedemo-checkout/advanced-workflows.spec.ts
```
- ✅ Multi-item checkout with verification at each step
- ✅ Checkout with quantity verification and tax calculation
- ✅ Cart persistence through navigation
- ✅ Form field state preservation during validation
- ✅ Remove and re-add item workflow

---

## 🎮 Running Tests by Category

### All Happy Path Tests
```bash
npx playwright test -g "happy path|valid data|complete" tests/saucedemo-checkout/
```

### All Error/Validation Tests
```bash
npx playwright test -g "error|validation|empty" tests/saucedemo-checkout/
```

### All Navigation Tests
```bash
npx playwright test -g "navigation|back|cancel|continue" tests/saucedemo-checkout/
```

### All Cart Tests
```bash
npx playwright test tests/saucedemo-checkout/cart-view-multiple-items.spec.ts
```

### All Checkout Tests (Shipping + Order)
```bash
npx playwright test tests/saucedemo-checkout/shipping-* tests/saucedemo-checkout/order-*
```

---

## 🌐 Browser-Specific Testing

### Test on Chrome Only
```bash
npx playwright test tests/saucedemo-checkout/ --project=chromium
```

### Test on Firefox Only
```bash
npx playwright test tests/saucedemo-checkout/ --project=firefox
```

### Test on Safari Only
```bash
npx playwright test tests/saucedemo-checkout/ --project=webkit
```

### Test on All Browsers (Default)
```bash
npx playwright test tests/saucedemo-checkout/
```

---

## 🐛 Debug & Development Mode

### Interactive Debug Mode
```bash
npx playwright test tests/saucedemo-checkout/ --debug
```

### Headed Mode (See Browser Windows)
```bash
npx playwright test tests/saucedemo-checkout/ --headed
```

### UI Mode (Recommended for Development)
```bash
npx playwright test tests/saucedemo-checkout/ --ui
```

### Single Worker (Sequential Execution)
```bash
npx playwright test tests/saucedemo-checkout/ --workers=1
```

### With Screenshots on Failure
```bash
npx playwright test tests/saucedemo-checkout/ --screenshot=only-on-failure
```

### With Video Recording
```bash
npx playwright test tests/saucedemo-checkout/ --video=on
```

---

## 📊 Reporting & Results

### Generate HTML Report
```bash
npx playwright test tests/saucedemo-checkout/
npx playwright show-report
```

### List All Tests (Without Running)
```bash
npx playwright test tests/saucedemo-checkout/ --list
```

### Generate JSON Report
```bash
npx playwright test tests/saucedemo-checkout/ --reporter=json > results.json
```

### Verbose Output
```bash
npx playwright test tests/saucedemo-checkout/ --reporter=verbose
```

---

## 📋 Test Execution Patterns

### Pattern 1: Run Single Test
```bash
npx playwright test tests/saucedemo-checkout/cart-view-multiple-items.spec.ts -g "View shopping cart with multiple items"
```

### Pattern 2: Run Tests by Keyword
```bash
npx playwright test tests/saucedemo-checkout/ -g "multiple items"
```

### Pattern 3: Run Multiple Files
```bash
npx playwright test tests/saucedemo-checkout/cart-view-multiple-items.spec.ts tests/saucedemo-checkout/shipping-info-happy-path.spec.ts
```

### Pattern 4: Run Recent Test Results
```bash
npx playwright test tests/saucedemo-checkout/ --last-failed
```

### Pattern 5: Run with Test Timeout Override
```bash
npx playwright test tests/saucedemo-checkout/ --timeout=60000
```

---

## 🔧 Advanced Usage

### Run Tests in Specific Order
```bash
npx playwright test tests/saucedemo-checkout/cart-*.spec.ts tests/saucedemo-checkout/shipping-*.spec.ts
```

### Run Tests with Custom Environment
```bash
TARGET_URL=https://www.saucedemo.com npx playwright test tests/saucedemo-checkout/
```

### Generate Trace Files (Debugging)
```bash
npx playwright test tests/saucedemo-checkout/ --trace on
```

### Update Snapshots (If Using Visual Regression)
```bash
npx playwright test tests/saucedemo-checkout/ --update-snapshots
```

---

## 🚨 Troubleshooting Quick Fixes

### Tests Timing Out
```bash
# Increase timeout to 60 seconds
npx playwright test tests/saucedemo-checkout/ --timeout=60000
```

### Selector Not Found
```bash
# Run in debug mode to inspect
npx playwright test tests/saucedemo-checkout/ --debug
```

### Tests Fail on Specific Browser
```bash
# Test only on working browser first
npx playwright test tests/saucedemo-checkout/ --project=chromium
```

### Need to See Browser Window
```bash
# Run in headed mode
npx playwright test tests/saucedemo-checkout/ --headed
```

---

## 📝 Key Test Credentials & Data

### Login
- **Username:** standard_user
- **Password:** secret_sauce
- **URL:** https://www.saucedemo.com

### Test Products
- Sauce Labs Backpack - $49.99
- Sauce Labs Bike Light - $9.99
- Sauce Labs Bolt T-Shirt - $15.99
- Test.allTheThings() T-Shirt - $15.99

### Sample Shipping Data
```javascript
{
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345'
}
```

---

## 💾 Useful Selectors Reference

```javascript
// Login
input[data-test="username"]
input[data-test="password"]
input[data-test="login-button"]

// Products & Cart
button[data-test*="add-to-cart"]
.shopping_cart_link
.shopping_cart_badge

// Checkout Step 1
input[data-test="firstName"]
input[data-test="lastName"]
input[data-test="postalCode"]
input[data-test="continue"]
a[data-test="cancel"]

// Checkout Step 2
.checkout_summary
.summary_total_label
button[data-test="finish"]

// Confirmation
.complete-header
button[data-test="back-home"]
```

---

## 🎯 Common Command Combinations

```bash
# Full suite with report in headed mode
npx playwright test tests/saucedemo-checkout/ --headed && npx playwright show-report

# Quick validation run (headless)
npx playwright test tests/saucedemo-checkout/ --workers=4

# Debug single test
npx playwright test tests/saucedemo-checkout/cart-view-multiple-items.spec.ts -g "multiple items" --debug

# Run and report
npx playwright test tests/saucedemo-checkout/ --reporter=html && npx playwright show-report

# Parallel test runs with increased workers
npx playwright test tests/saucedemo-checkout/ --workers=6

# Test specific functionality area
npx playwright test tests/saucedemo-checkout/ -g "cart" --headed
```

---

## 📖 Documentation Files

- 📄 **README.md** - Complete documentation with patterns and setup
- 📄 **TEST-GENERATION-SUMMARY.md** - Detailed test inventory and coverage
- 📄 **fixtures-and-utilities.ts** - Reusable test data and helper functions
- 📄 **QUICK-REFERENCE.md** - This file

---

## ✅ Verification Checklist

Before running tests:
- [ ] Playwright installed: `npm list @playwright/test`
- [ ] Tests exist: `ls tests/saucedemo-checkout/`
- [ ] Node.js version 14+: `node --version`
- [ ] Working internet connection (for https://www.saucedemo.com)

---

## 🎓 Learning Path

1. **Start here:** `npx playwright test tests/saucedemo-checkout/ --ui`
2. **Read:** tests/saucedemo-checkout/README.md
3. **Explore:** View individual test files in VS Code
4. **Run:** Execute specific test files
5. **Debug:** Use --debug mode for failing tests
6. **Extend:** Create custom tests using utilities

---

**Last Updated:** May 4, 2026  
**Total Tests:** 33  
**Status:** ✅ Production Ready
