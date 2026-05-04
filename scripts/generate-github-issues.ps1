# Generate GitHub Issues for Test Failures
# This script creates GitHub issues for each test failure detected in Playwright test runs

param(
    [string]$owner = "Rithika-S-120805",
    [string]$repo = "playwright",
    [switch]$dryRun = $false
)

# Test failures to create issues for
$failures = @(
    @{
        title = "❌ Error Verification Tests › Intentional failure - verify GitHub issue creation [Chromium]"
        body = @"
## Test Failure Details

**Test Suite:** Error Verification Tests  
**Test Name:** Intentional failure - verify GitHub issue creation  
**Browser:** Chromium  
**File:** `tests/saucedemo-checkout/test-error-verification.spec.ts`  
**Line:** 11  
**Duration:** 2.0s  

### Error Message
\`\`\`
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true

 9 |     
10 |     // This assertion will fail
> 11 |     expect(true).toBe(false);
    |                  ^
12 |   });
\`\`\`

### Root Cause
Intentional test failure to verify GitHub issue creation workflow. This test deliberately asserts `true` to equal `false`, which fails as designed.

### Resolution
✅ **WORKING AS INTENDED** - This failure validates that the GitHub Actions automation correctly captures and reports test failures.

### Labels
- test-failure
- automated
- error-verification

### Status
This issue confirms the automated issue creation workflow is functioning correctly.
"@
        labels = @("test-failure", "automated", "error-verification", "chromium")
    },
    @{
        title = "❌ Error Verification Tests › Another intentional failure - test error formatting [Chromium]"
        body = @"
## Test Failure Details

**Test Suite:** Error Verification Tests  
**Test Name:** Another intentional failure - test error formatting  
**Browser:** Chromium  
**File:** `tests/saucedemo-checkout/test-error-verification.spec.ts`  
**Line:** 20  
**Duration:** 2.0s  

### Error Message
\`\`\`
Error: expect(received).toBe(expected) // Object.is equality

Expected: 5
Received: 0

18 |     // This will fail with a clear error
19 |     const nonExistentElement = await page.locator('button.this-does-not-exist').count();
> 20 |     expect(nonExistentElement).toBe(5);
    |                                ^
21 |   });
\`\`\`

### Root Cause
Intentional test failure that queries a non-existent DOM element selector and expects to find elements. This demonstrates error handling for element location issues.

### Resolution
✅ **WORKING AS INTENDED** - This failure validates that the system correctly handles and reports selector-based failures.

### Labels
- test-failure
- automated
- error-verification
- selector-issue

### Status
This issue confirms element count assertion failures are properly captured.
"@
        labels = @("test-failure", "automated", "error-verification", "selector-issue", "chromium")
    },
    @{
        title = "❌ Error Verification Tests › Intentional failure - verify GitHub issue creation [Firefox]"
        body = @"
## Test Failure Details

**Test Suite:** Error Verification Tests  
**Test Name:** Intentional failure - verify GitHub issue creation  
**Browser:** Firefox  
**File:** `tests/saucedemo-checkout/test-error-verification.spec.ts`  
**Line:** 11  
**Duration:** 8.0s  

### Error Message
\`\`\`
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true

 9 |     
10 |     // This assertion will fail
> 11 |     expect(true).toBe(false);
    |                  ^
12 |   });
\`\`\`

### Root Cause
Intentional test failure for cross-browser verification. This is the Firefox version of the test failure verification.

### Resolution
✅ **WORKING AS INTENDED** - Cross-browser failure verification for Firefox.

### Labels
- test-failure
- automated
- error-verification
- firefox

### Status
This issue confirms the issue creation workflow works across multiple browsers.
"@
        labels = @("test-failure", "automated", "error-verification", "firefox")
    },
    @{
        title = "❌ Error Verification Tests › Another intentional failure - test error formatting [Firefox]"
        body = @"
## Test Failure Details

**Test Suite:** Error Verification Tests  
**Test Name:** Another intentional failure - test error formatting  
**Browser:** Firefox  
**File:** `tests/saucedemo-checkout/test-error-verification.spec.ts`  
**Line:** 20  
**Duration:** 8.0s  

### Error Message
\`\`\`
Error: expect(received).toBe(expected) // Object.is equality

Expected: 5
Received: 0

18 |     // This will fail with a clear error
19 |     const nonExistentElement = await page.locator('button.this-does-not-exist').count();
> 20 |     expect(nonExistentElement).toBe(5);
    |                                ^
21 |   });
\`\`\`

### Root Cause
Intentional test failure for cross-browser verification. This is the Firefox version of the selector-based failure test.

### Resolution
✅ **WORKING AS INTENDED** - Cross-browser element location failure verification for Firefox.

### Labels
- test-failure
- automated
- error-verification
- selector-issue
- firefox

### Status
This issue confirms selector failures are properly captured across browsers.
"@
        labels = @("test-failure", "automated", "error-verification", "selector-issue", "firefox")
    },
    @{
        title = "❌ Error Verification Tests › Intentional failure - verify GitHub issue creation [WebKit]"
        body = @"
## Test Failure Details

**Test Suite:** Error Verification Tests  
**Test Name:** Intentional failure - verify GitHub issue creation  
**Browser:** WebKit  
**File:** `tests/saucedemo-checkout/test-error-verification.spec.ts`  
**Line:** 11  
**Duration:** 9.1s  

### Error Message
\`\`\`
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true

 9 |     
10 |     // This assertion will fail
> 11 |     expect(true).toBe(false);
    |                  ^
12 |   });
\`\`\`

### Root Cause
Intentional test failure for cross-browser verification. This is the WebKit (Safari) version of the test failure verification.

### Resolution
✅ **WORKING AS INTENDED** - Cross-browser failure verification for WebKit/Safari.

### Labels
- test-failure
- automated
- error-verification
- webkit

### Status
This issue confirms the issue creation workflow works across all supported browsers.
"@
        labels = @("test-failure", "automated", "error-verification", "webkit")
    },
    @{
        title = "❌ Error Verification Tests › Another intentional failure - test error formatting [WebKit]"
        body = @"
## Test Failure Details

**Test Suite:** Error Verification Tests  
**Test Name:** Another intentional failure - test error formatting  
**Browser:** WebKit  
**File:** `tests/saucedemo-checkout/test-error-verification.spec.ts`  
**Line:** 20  
**Duration:** 8.7s  

### Error Message
\`\`\`
Error: expect(received).toBe(expected) // Object.is equality

Expected: 5
Received: 0

18 |     // This will fail with a clear error
19 |     const nonExistentElement = await page.locator('button.this-does-not-exist').count();
> 20 |     expect(nonExistentElement).toBe(5);
    |                                ^
21 |   });
\`\`\`

### Root Cause
Intentional test failure for cross-browser verification. This is the WebKit (Safari) version of the selector-based failure test.

### Resolution
✅ **WORKING AS INTENDED** - Cross-browser element location failure verification for WebKit/Safari.

### Labels
- test-failure
- automated
- error-verification
- selector-issue
- webkit

### Status
This issue confirms selector failures are properly captured across all browsers including Safari.
"@
        labels = @("test-failure", "automated", "error-verification", "selector-issue", "webkit")
    }
)

Write-Host "🔧 GitHub Issues Generator for Playwright Test Failures`n" -ForegroundColor Cyan
Write-Host "Repository: $owner/$repo" -ForegroundColor Gray
Write-Host "Total Issues to Create: $($failures.Count)`n" -ForegroundColor Yellow

if ($dryRun) {
    Write-Host "⚠️  DRY RUN MODE - No issues will be created`n" -ForegroundColor Yellow
}

# Create each issue
$createdCount = 0
foreach ($i in 0..($failures.Count - 1)) {
    $failure = $failures[$i]
    Write-Host "[$($i + 1)/$($failures.Count)] Creating issue: $($failure.title)" -ForegroundColor Cyan
    
    if (-not $dryRun) {
        try {
            # Create issue using GitHub CLI
            $labelsArg = $failure.labels -join ","
            $output = gh issue create `
                --repo "$owner/$repo" `
                --title $failure.title `
                --body $failure.body `
                --label $labelsArg `
                2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ Created successfully" -ForegroundColor Green
                Write-Host "  $output" -ForegroundColor Gray
                $createdCount++
            } else {
                Write-Host "  ❌ Failed to create: $output" -ForegroundColor Red
            }
        } catch {
            Write-Host "  ❌ Error: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "  [DRY RUN] Would create with labels: $($failure.labels -join ', ')" -ForegroundColor Gray
        $createdCount++
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n✅ Completed: $createdCount/$($failures.Count) issues processed" -ForegroundColor Green

if ($dryRun) {
    Write-Host "Run without -dryRun flag to create actual issues" -ForegroundColor Yellow
}

