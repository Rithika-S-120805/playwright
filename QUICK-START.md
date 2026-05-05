# Quick Start: Automatic GitHub Issue Creation for Test Failures

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure GitHub Token

#### Option A: Environment Variables (Local Development)
```bash
cp .env.example .env
# Edit .env and add your GitHub token
```

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPOSITORY_OWNER=your-org
GITHUB_REPOSITORY_NAME=your-repo
```

#### Option B: GitHub Actions (Automated)
Your GitHub token is automatically available in Actions as `secrets.GITHUB_TOKEN`

The workflow file at `.github/workflows/test-failure-issue-creation.yml` handles this automatically.

### Step 3: Verify Setup

**Check 1: Confirm environment variables**
```bash
echo $GITHUB_TOKEN
echo $GITHUB_REPOSITORY_OWNER
echo $GITHUB_REPOSITORY_NAME
```

**Check 2: Run tests**
```bash
npm test
```

Failed tests will now automatically create GitHub issues!

---

## Architecture Overview

```
Playwright Tests
    ↓
GitHubIssueReporter (Custom Reporter)
    ↓
Test Failure Detected
    ↓
GitHubIssueManager
    ├── Search for existing issues (duplicate prevention)
    ├── If exists → Add comment with new failure
    └── If not exists → Create new issue
    ↓
GitHub Issue Created ✓
```

---

## How It Works

### 1. **Test Execution**
```bash
npm test
```
Tests run using Playwright. The custom `GitHubIssueReporter` listens for failures.

### 2. **Failure Detection**
When a test fails, the reporter extracts:
- Test name and path
- Browser/environment
- Error message and stack trace
- Timestamp and duration

### 3. **GitHub Integration**
- Searches for existing open issues with same test name
- **If found:** Adds a comment with the new failure details
- **If not found:** Creates a new issue with full failure details

### 4. **Issue Metadata**
Issues automatically include:
- Labels: `test-failure`, `browser-{name}`, `flaky-test`, `slow-test`
- Assignees: Set via `GITHUB_ISSUE_ASSIGNEES`
- Rich formatted body with all error details

---

## Usage Examples

### Local Testing

**Run tests and create issues:**
```bash
npm test
```

**Run tests without creating issues:**
```bash
npm test
# (if GITHUB_TOKEN is not set, issues won't be created)
```

**Run specific test:**
```bash
npm test -- tests/login/auth.spec.ts
```

**Debug mode:**
```bash
npm run test:debug
```

### GitHub Actions

Issues are automatically created when:
1. Tests run in CI/CD pipeline
2. A test fails
3. GitHub Actions workflow is triggered

**Trigger workflow manually:**
```bash
git push origin main
```

Or in GitHub UI: Actions → Test Failure Issue Creation → Run workflow

### Post-Test Processing

Process failures from an existing test results file:
```bash
npm run process-failures
```

---

## API Reference

### Create Issue Manually

```typescript
import { GitHubIssueManager } from './src/utils/github-issue-manager';

const manager = new GitHubIssueManager({
  token: process.env.GITHUB_TOKEN,
  owner: 'my-org',
  repo: 'my-repo',
});

await manager.createIssueIfNotExists({
  testName: 'Login should authenticate',
  testPath: 'tests/login.spec.ts',
  browser: 'chromium',
  errorMessage: 'Timeout waiting for button',
  stackTrace: '...',
  timestamp: new Date().toISOString(),
  duration: 5000,
  retries: 0,
});
```

### View Examples

```bash
# See 7 different implementation examples
npm run examples
```

See [examples/github-issue-example.ts](examples/github-issue-example.ts) for:
- Using `GitHubIssueManager` directly
- Direct fetch API calls
- Batch creating issues
- Searching for existing issues
- Adding comments to issues
- Closing issues
- Using axios instead of fetch

---

## Issue Template

Created issues look like:

```markdown
## Test Failure Report

**Test Name:** `Login > should authenticate user`
**Browser:** chromium
**Test File:** `tests/login/auth.spec.ts`
**Timestamp:** 5/5/2026, 2:30 PM
**Duration:** 30,000ms
**Retries:** 0

---

## Error Message

Timeout waiting for selector "button[type="submit"]"

---

## Stack Trace

Error: Timeout waiting for selector "button[type="submit"]"
  at Object.<anonymous> (node_modules/playwright/lib/utils/utils.js:123:45)
  at async loginPage.submitForm (tests/pages/login.ts:45:12)
  at async test (tests/login/auth.spec.ts:15:5)

---

## Steps to Reproduce

1. Run the test suite: `npm test`
2. The test `Login > should authenticate user` should fail on `chromium` browser
3. Check the detailed error above
```

---

## File Structure

```
playwright/
├── .env                              # Your GitHub token (not committed)
├── .env.example                      # Template for .env
├── .github/
│   └── workflows/
│       └── test-failure-issue-creation.yml  # GitHub Actions workflow
├── src/
│   ├── reporters/
│   │   └── github-issue-reporter.ts         # Custom Playwright reporter
│   └── utils/
│       └── github-issue-manager.ts          # GitHub API integration
├── examples/
│   └── github-issue-example.ts              # Usage examples
├── scripts/
│   └── process-test-failures.ts             # Post-test processor
├── playwright.config.ts             # Updated with custom reporter
├── package.json                     # Updated with scripts
└── GITHUB-ISSUES-SETUP.md          # Detailed documentation
```

---

## Troubleshooting

### Issues not being created?

1. **Check GitHub token:**
   ```bash
   echo $GITHUB_TOKEN | head -c 10
   # Should output: ghp_xxxxxxxx
   ```

2. **Check repository settings:**
   ```bash
   echo $GITHUB_REPOSITORY_OWNER
   echo $GITHUB_REPOSITORY_NAME
   ```

3. **Run with verbose logging:**
   ```bash
   GITHUB_TOKEN=ghp_xxx npm test
   ```

### Token permissions?

Your token needs:
- `repo` - Full control of repositories
- `issues` - Read/write access to issues

Create a new token at: https://github.com/settings/tokens

### Rate limiting?

GitHub API limits:
- **Authenticated users:** 5,000 requests/hour
- **Search:** 30 requests/minute

For high-volume suites, batch process offline.

---

## Best Practices

✅ **DO:**
- Store `GITHUB_TOKEN` in `.env` (add to `.gitignore`)
- Use specific token with minimal permissions
- Rotate tokens periodically
- Test locally before pushing to CI

❌ **DON'T:**
- Commit `.env` file with secrets
- Use personal access tokens in code
- Hardcode repository names
- Forget to set `GITHUB_REPOSITORY_OWNER` and `GITHUB_REPOSITORY_NAME`

---

## Next Steps

1. **Read detailed docs:** [GITHUB-ISSUES-SETUP.md](GITHUB-ISSUES-SETUP.md)
2. **Run examples:** `npm run examples`
3. **Run tests:** `npm test`
4. **Check GitHub:** Go to your repository Issues tab

---

## Support

For more information:
- [Detailed Setup Guide](GITHUB-ISSUES-SETUP.md)
- [Implementation Examples](examples/github-issue-example.ts)
- [GitHub API Docs](https://docs.github.com/en/rest)
- [Playwright Reporter Docs](https://playwright.dev/docs/test-reporters)
