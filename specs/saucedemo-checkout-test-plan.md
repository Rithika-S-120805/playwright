# SauceDemo Checkout Workflow - Comprehensive Test Plan

## Application Overview

This test plan covers the complete e-commerce checkout workflow for the SauceDemo application (https://www.saucedemo.com). The application allows users to browse products, add items to a shopping cart, and complete a purchase through a multi-step checkout process. This plan includes test scenarios for all 8 acceptance criteria covering cart view, shipping information entry, order summary review, order completion, and confirmation. Test scenarios include happy path workflows, negative test cases for validation errors, boundary condition testing, and edge case handling. All tests assume a fresh login state with the standard_user credentials.

## Test Scenarios

### 1. Cart View and Navigation

**Seed:** `tests/seed.spec.ts`

#### 1.1. AC1-001: View shopping cart with multiple items

**File:** `tests/checkout/cart-view.spec.ts`

**Steps:**
  1. Login to SauceDemo with credentials: standard_user / secret_sauce
    - expect: Successfully logged in
    - expect: Products page displayed
  2. Add 'Sauce Labs Backpack' to cart
    - expect: Item added to cart
    - expect: Cart counter incremented to 1
  3. Add 'Sauce Labs Bike Light' to cart
    - expect: Second item added to cart
    - expect: Cart counter incremented to 2
  4. Click on shopping cart icon
    - expect: Cart page displayed
    - expect: All added items are visible
  5. Verify cart item details
    - expect: Item names are displayed correctly
    - expect: Quantities are shown as 1 for each item
    - expect: Individual prices are displayed
    - expect: Subtotal/total is calculated correctly

#### 1.2. AC1-002: View cart with single item

**File:** `tests/checkout/cart-view.spec.ts`

**Steps:**
  1. Login to SauceDemo
    - expect: Successfully logged in
  2. Add only 'Sauce Labs T-Shirt' to cart
    - expect: Item added to cart
  3. Navigate to cart page
    - expect: Cart page shows one item
    - expect: Quantity displayed as 1
    - expect: Price displayed correctly

#### 1.3. AC1-003: View empty cart

**File:** `tests/checkout/cart-view.spec.ts`

**Steps:**
  1. Login to SauceDemo
    - expect: Successfully logged in
  2. Click shopping cart icon without adding any items
    - expect: Cart page displayed
    - expect: Empty cart message or state shown
    - expect: Cart icon shows 0 or is empty

#### 1.4. AC1-004: Verify cart totals calculation

**File:** `tests/checkout/cart-view.spec.ts`

**Steps:**
  1. Login and add multiple items (Backpack $49.99, Bike Light $9.99, Bolt T-Shirt $15.99) to cart
    - expect: All items added successfully
  2. Navigate to cart page
    - expect: Subtotal displayed correctly ($75.97)
    - expect: Tax calculated if applicable
    - expect: Total amount is accurate

#### 1.5. AC1-005: Remove item from cart

**File:** `tests/checkout/cart-view.spec.ts`

**Steps:**
  1. Login and add 2 items to cart
    - expect: Cart shows 2 items
  2. Navigate to cart page
    - expect: Both items visible
  3. Click 'Remove' button for first item
    - expect: Item removed from cart
    - expect: Cart now shows 1 item
    - expect: Totals recalculated

### 2. Shipping Information - Happy Path

**Seed:** `tests/seed.spec.ts`

#### 2.1. AC2-001: Enter complete shipping information

**File:** `tests/checkout/shipping-info.spec.ts`

**Steps:**
  1. Login to SauceDemo and add items to cart (minimum 1 item)
    - expect: Items added successfully
  2. Navigate to shopping cart and click 'Checkout' button
    - expect: Checkout page step 1 displayed
    - expect: Shipping form visible
  3. Enter First Name: 'John'
    - expect: First name field populated
  4. Enter Last Name: 'Doe'
    - expect: Last name field populated
  5. Enter Zip/Postal Code: '12345'
    - expect: Zip code field populated
  6. Click 'Continue' button
    - expect: Form validated successfully
    - expect: Navigation to checkout step 2
    - expect: Entered data persisted

#### 2.2. AC2-002: Shipping info with special characters in name

**File:** `tests/checkout/shipping-info.spec.ts`

**Steps:**
  1. Add item to cart and navigate to checkout step 1
    - expect: Checkout form displayed
  2. Enter First Name: 'Jean-Pierre'
    - expect: First name with hyphen accepted
  3. Enter Last Name: "O'Connor"
    - expect: Last name with apostrophe accepted
  4. Enter Zip Code: '90210'
    - expect: Zip code accepted
  5. Click Continue
    - expect: Form accepted and navigated to step 2

#### 2.3. AC2-003: Shipping info with international zip formats

**File:** `tests/checkout/shipping-info.spec.ts`

**Steps:**
  1. Add item to cart and navigate to checkout step 1
    - expect: Checkout form displayed
  2. Enter First Name: 'Anna'
    - expect: First name accepted
  3. Enter Last Name: 'Schmidt'
    - expect: Last name accepted
  4. Enter Zip Code: 'SW1A 2AA' (UK postal code format)
    - expect: International postal code format accepted
    - expect: Form successfully validates

### 3. Shipping Information - Validation & Errors

**Seed:** `tests/seed.spec.ts`

#### 3.1. AC8-001: Error when First Name is empty

**File:** `tests/checkout/shipping-validation.spec.ts`

**Steps:**
  1. Add item to cart and navigate to checkout step 1
    - expect: Checkout form displayed
  2. Leave First Name field empty
    - expect: First name field remains empty
  3. Enter Last Name: 'Doe' and Zip Code: '12345'
    - expect: Last name and zip code fields populated
  4. Click 'Continue' button
    - expect: Form validation fails
    - expect: Error message displayed for First Name field
    - expect: User remains on checkout step 1

#### 3.2. AC8-002: Error when Last Name is empty

**File:** `tests/checkout/shipping-validation.spec.ts`

**Steps:**
  1. Add item to cart and navigate to checkout step 1
    - expect: Checkout form displayed
  2. Enter First Name: 'John'
    - expect: First name populated
  3. Leave Last Name field empty
    - expect: Last name remains empty
  4. Enter Zip Code: '12345'
    - expect: Zip code populated
  5. Click 'Continue' button
    - expect: Error message displayed for Last Name
    - expect: User stays on checkout step 1

#### 3.3. AC8-003: Error when Zip Code is empty

**File:** `tests/checkout/shipping-validation.spec.ts`

**Steps:**
  1. Add item to cart and navigate to checkout step 1
    - expect: Checkout form displayed
  2. Enter First Name: 'John' and Last Name: 'Doe'
    - expect: Both fields populated
  3. Leave Zip Code field empty
    - expect: Zip code remains empty
  4. Click 'Continue' button
    - expect: Error message shown for Zip Code field
    - expect: Form not submitted

#### 3.4. AC8-004: Error when all fields are empty

**File:** `tests/checkout/shipping-validation.spec.ts`

**Steps:**
  1. Add item to cart and navigate to checkout step 1
    - expect: Checkout form displayed with empty fields
  2. Click 'Continue' button without filling any fields
    - expect: Validation errors shown for all required fields
    - expect: Appropriate error messages for each field

#### 3.5. AC8-005: Error with only spaces in First Name

**File:** `tests/checkout/shipping-validation.spec.ts`

**Steps:**
  1. Add item to cart and navigate to checkout step 1
    - expect: Checkout form displayed
  2. Enter First Name: '    ' (only spaces)
    - expect: Spaces entered in first name
  3. Enter Last Name: 'Doe' and Zip Code: '12345'
    - expect: Other fields populated
  4. Click 'Continue' button
    - expect: Validation fails for empty/whitespace-only first name

### 4. Order Summary and Confirmation

**Seed:** `tests/seed.spec.ts`

#### 4.1. AC3-001 & AC4-001: Review order summary on checkout step 2

**File:** `tests/checkout/order-summary.spec.ts`

**Steps:**
  1. Login and add 'Sauce Labs Backpack' ($49.99) and 'Sauce Labs Bike Light' ($9.99) to cart
    - expect: Items added successfully
  2. Navigate to cart and start checkout
    - expect: On checkout step 1
  3. Fill shipping information: First Name: 'John', Last Name: 'Doe', Zip: '12345'
    - expect: Form fields populated
  4. Click 'Continue' button
    - expect: Navigated to checkout step 2 (order summary page)
  5. Verify order summary displays
    - expect: All items listed with correct names
    - expect: Quantities and individual prices shown
    - expect: Subtotal calculated ($59.98)
    - expect: Tax calculated if applicable
    - expect: Total amount displayed correctly

#### 4.2. AC3-002 & AC4-002: Order summary with single item

**File:** `tests/checkout/order-summary.spec.ts`

**Steps:**
  1. Add only 'Test.allTheThings() T-Shirt' ($15.99) to cart
    - expect: Single item in cart
  2. Complete checkout step 1 with valid shipping info
    - expect: On checkout step 2
  3. Verify order summary
    - expect: Single item displayed
    - expect: Price and quantity correct
    - expect: Total matches subtotal with tax

#### 4.3. AC6-001 & AC7-001: Complete purchase and see confirmation

**File:** `tests/checkout/order-completion.spec.ts`

**Steps:**
  1. Add items to cart, fill shipping info, and reach checkout step 2
    - expect: On order summary page
  2. Click 'Finish' button to complete purchase
    - expect: Purchase processed successfully
    - expect: Navigated to order confirmation page
  3. Verify confirmation page displays
    - expect: 'Thank you for your order!' message shown
    - expect: Confirmation text displayed: 'Your order has been dispatched...'
    - expect: Order number or reference displayed
    - expect: URL changed to checkout-complete.html

#### 4.4. AC7-002: Order confirmation page elements

**File:** `tests/checkout/order-completion.spec.ts`

**Steps:**
  1. Complete a full checkout and reach confirmation page
    - expect: On confirmation page
  2. Verify all confirmation elements are present
    - expect: Confirmation header visible
    - expect: Confirmation message visible
    - expect: Thank you message displayed
    - expect: Pony Express reference shown

### 5. Edge Cases and Boundary Conditions

**Seed:** `tests/seed.spec.ts`

#### 5.1. EC-001: Very long name values

**File:** `tests/checkout/edge-cases.spec.ts`

**Steps:**
  1. Add item to cart and navigate to checkout step 1
    - expect: Checkout form displayed
  2. Enter First Name: 'Christopher' (11 characters)
    - expect: Long name accepted
  3. Enter Last Name: 'Westervelt-Anderson' (19 characters)
    - expect: Long last name accepted
  4. Enter Zip Code: '90210'
    - expect: Zip code populated
  5. Click 'Continue'
    - expect: Form accepted, navigated to step 2
    - expect: Data displayed correctly without truncation

#### 5.2. EC-002: Minimum valid zip code (single digit)

**File:** `tests/checkout/edge-cases.spec.ts`

**Steps:**
  1. Add item and navigate to checkout step 1
    - expect: Form displayed
  2. Enter First Name: 'John', Last Name: 'Doe'
    - expect: Names populated
  3. Enter Zip Code: '0'
    - expect: Single digit zip accepted or error shown
  4. Click Continue
    - expect: Either proceeds to step 2 or shows validation error for invalid format

#### 5.3. EC-003: Maximum length zip code

**File:** `tests/checkout/edge-cases.spec.ts`

**Steps:**
  1. Add item and navigate to checkout step 1
    - expect: Form displayed
  2. Enter names: 'John', 'Doe'
    - expect: Names populated
  3. Enter Zip Code: '123456789' (9 digits)
    - expect: Long zip code either accepted or limited by form
  4. Click Continue
    - expect: Either proceeds or shows validation message

#### 5.4. EC-004: Numeric values in name fields

**File:** `tests/checkout/edge-cases.spec.ts`

**Steps:**
  1. Add item and navigate to checkout step 1
    - expect: Form displayed
  2. Enter First Name: '123John'
    - expect: Numeric prefix accepted or rejected
  3. Enter Last Name: 'Doe456'
    - expect: Numeric suffix in name handled
  4. Enter Zip Code: '12345'
    - expect: Zip code populated
  5. Click Continue
    - expect: Form behavior determined - accepts or validates name format

#### 5.5. EC-005: Unicode/emoji characters in name

**File:** `tests/checkout/edge-cases.spec.ts`

**Steps:**
  1. Add item and navigate to checkout step 1
    - expect: Form displayed
  2. Enter First Name: 'José'
    - expect: Unicode character (accent) handled
  3. Enter Last Name: 'Müller'
    - expect: Umlaut character handled
  4. Enter Zip Code: '12345'
    - expect: Zip populated
  5. Click Continue
    - expect: Form accepted or validates international characters appropriately

### 6. Navigation and Workflow

**Seed:** `tests/seed.spec.ts`

#### 6.1. NW-001: Cancel checkout and return to products

**File:** `tests/checkout/navigation.spec.ts`

**Steps:**
  1. Add item to cart and navigate to checkout step 1
    - expect: On checkout step 1
  2. Look for Cancel or Back button
    - expect: Navigation option visible
  3. Click cancel/back button if available
    - expect: Return to previous page (cart or products)
    - expect: Cart contents preserved

#### 6.2. NW-002: Back button functionality in checkout

**File:** `tests/checkout/navigation.spec.ts`

**Steps:**
  1. Fill checkout step 1 and click Continue
    - expect: On checkout step 2
  2. Look for Back button on step 2
    - expect: Back navigation option present
  3. Click Back button
    - expect: Return to checkout step 1
    - expect: Previously entered data may be preserved or cleared

#### 6.3. NW-003: Logout during checkout

**File:** `tests/checkout/navigation.spec.ts`

**Steps:**
  1. Add item to cart and navigate to checkout step 1
    - expect: On checkout page
  2. Click logout/menu button if available
    - expect: Logout option visible or logout occurs
  3. Logout from application
    - expect: Returned to login page
    - expect: Session ended
  4. Login again and check cart
    - expect: Cart may be preserved or cleared depending on implementation

#### 6.4. NW-004: Direct URL access to checkout steps

**File:** `tests/checkout/navigation.spec.ts`

**Steps:**
  1. Log in to SauceDemo
    - expect: Successfully logged in
  2. Directly navigate to checkout-step-two.html
    - expect: Either redirected to step 1, or displayed with cart data

### 7. Form Input Validation Details

**Seed:** `tests/seed.spec.ts`

#### 7.1. FV-001: First Name field accepts valid input

**File:** `tests/checkout/form-validation.spec.ts`

**Steps:**
  1. Add item and navigate to checkout step 1
    - expect: Form displayed
  2. Click First Name input field
    - expect: Field focused and ready for input
  3. Type: 'Michael'
    - expect: Text entered successfully
    - expect: Field shows entered text
  4. Enter Last Name: 'Smith' and Zip: '54321'
    - expect: All fields populated
  5. Click Continue
    - expect: Form validated and submitted successfully

#### 7.2. FV-002: Tab navigation between form fields

**File:** `tests/checkout/form-validation.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Form displayed
  2. Click First Name field and enter 'John'
    - expect: First name populated
  3. Press Tab key to move to Last Name field
    - expect: Focus moves to Last Name field
  4. Type 'Doe'
    - expect: Last name entered in focused field
  5. Press Tab to move to Zip Code field
    - expect: Focus moves to Zip Code
  6. Type '12345'
    - expect: Zip code entered

#### 7.3. FV-003: Field clearing and re-entry

**File:** `tests/checkout/form-validation.spec.ts`

**Steps:**
  1. Navigate to checkout step 1
    - expect: Form displayed
  2. Enter First Name: 'John'
    - expect: Text displayed in field
  3. Select all text (Ctrl+A) and delete
    - expect: Field cleared, appears empty
  4. Type new name: 'Jane'
    - expect: New text displayed correctly
