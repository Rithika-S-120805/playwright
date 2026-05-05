# Automatic GitHub Issue Creation for Playwright Test Failures

## 📋 Summary

This solution automatically creates GitHub issues when Playwright tests fail, with built-in duplicate prevention, detailed error reporting, and GitHub Actions integration.

### ✨ Key Features

- ✅ **Automatic Detection** - Custom Playwright reporter detects all test failures
- ✅ **Duplicate Prevention** - Searches for existing issues before creating new ones
- ✅ **Failure Aggregation** - Adds comments to existing issues instead of duplicates
- ✅ **Auto-Labeling** - Adds labels: `test-failure`, `browser-{name}`, `flaky-test`, `slow-test`
- ✅ **Rich Details** - Error messages, stack traces, environment, timestamps
- ✅ **CI/CD Ready** - GitHub Actions workflow included
- ✅ **Production-Ready** - TypeScript, error handling, proper logging
- ✅ **Highly Configurable** - Environment variables control behavior

---

## 📁 What's Included

### Core Implementation

| File | Purpose |
|------|---------|
| [src/reporters/github-issue-reporter.ts](src/reporters/github-issue-reporter.ts) | Custom Playwright reporter for failure detection |
| [src/utils/github-issue-manager.ts](src/utils/github-issue-manager.ts) | GitHub API integration & issue management |
| [scripts/process-test-failures.ts](scripts/process-test-failures.ts) | Post-test processor for batch issue creation |

### Configuration & Automation

| File | Purpose |
|------|---------|
| [playwright.config.ts](playwright.config.ts) | Updated with custom reporter |
| [package.json](package.json) | Scripts and dependencies |
| [.github/workflows/test-failure-issue-creation.yml](.github/workflows/test-failure-issue-creation.yml) | GitHub Actions workflow |
| [tsconfig.json](tsconfig.json) | TypeScript configuration |

### Documentation

| File | Purpose |
|------|---------|
| [QUICK-START.md](QUICK-START.md) | 5-minute setup guide |
| [GITHUB-ISSUES-SETUP.md](GITHUB-ISSUES-SETUP.md) | Comprehensive setup & usage |
| [IMPLEMENTATION-REFERENCE.md](IMPLEMENTATION-REFERENCE.md) | Technical deep-dive |
| [examples/github-issue-example.ts](examples/github-issue-example.ts) | 7 usage examples |

### Support Files

| File | Purpose |
|------|---------|
| [.env.example](.env.example) | Environment variables template |

---

## 🚀 Quick Start (5 Minutes)

### 1. Configure GitHub Token

```bash
# Copy template
cp .env.example .env

# Edit .env with your GitHub token
nano .env
```

**Required values:**
```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPOSITORY_OWNER=your-organization
GITHUB_REPOSITORY_NAME=your-repository-name
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Tests

```bash
npm test
```

**That's it!** Failed tests will automatically create GitHub issues.

---

## 🎯 How It Works

### Flow Diagram

```
┌─────────────────┐
│  npm test       │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Playwright executes tests               │
│ GitHubIssueReporter listens for failures│
└────────┬────────────────────────────────┘
         │
         ▼ (Test fails)
┌──────────────────────────────────────────┐
│ Extract failure details:                 │
│ - Test name & path                       │
│ - Error message & stack trace            │
│ - Browser/environment                    │
│ - Timestamp & duration                   │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Search for existing open issues          │
│ (Duplicate prevention)                   │
└────────┬─────────────────────────────────┘
         │
    ┌────┴─────────┐
    │              │
    ▼              ▼
  Found       Not Found
    │              │
    │              ▼
    │    ┌─────────────────────┐
    │    │ Create new issue    │
    │    │ With full details   │
    │    └─────────────────────┘
    │
    ▼
┌──────────────────────────────────────────┐
│ Add comment with new failure              │
│ (Tracks failure history)                 │
└──────────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────────┐
│ GitHub Issue Created ✓                    │
│ Link: https://github.com/.../issues/XXX  │
└──────────────────────────────────────────┘
```

---

## 🔧 Usage Examples

### Local Development

```bash
# Run tests (failures create issues automatically)
npm test

# Run with headed browser
npm run test:headed

# Run specific test file
npm test -- tests/login.spec.ts

# Debug mode
npm run test:debug
```

### Batch Processing

```bash
# Run tests and process failures
npm run test:with-issues

# Process existing results file
npm run process-failures
```

### View Examples

```bash
# See 7 different implementation approaches
npm run examples
```

---

## 📝 Issue Template

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

---

**Auto-generated by GitHub Issue Reporter**
Created: 2026-05-05T14:30:00.000Z
```

---

## 🏗️ Architecture

### Component Structure

```
playwrightagent/
├── src/
│   ├── reporters/
│   │   └── github-issue-reporter.ts
│   │       └── Listens for test failures
│   │       └── Delegates to GitHubIssueManager
│   │
│   └── utils/
│       └── github-issue-manager.ts
│           ├── Creates issues via GitHub API
│           ├── Searches for duplicates
│           ├── Adds comments to existing
│           └── Auto-generates labels
│
├── scripts/
│   └── process-test-failures.ts
│       └── Post-test batch processor
│
├── examples/
│   └── github-issue-example.ts
│       └── 7 usage patterns
│
└── .github/workflows/
    └── test-failure-issue-creation.yml
        └── GitHub Actions automation
```

### Data Flow

```
Test Failure
    ↓
GitHubIssueReporter.onTestEnd()
    ↓
Extract failure details
    ↓
Store in failedTests map
    ↓
GitHubIssueReporter.onEnd()
    ↓
GitHubIssueManager.createIssueIfNotExists()
    ├→ Search for existing issues
    ├→ If found: Add comment
    └→ If not found: Create new issue
    ↓
GitHub Issue Created/Updated
```

---

## 🔐 Security

### GitHub Token

- ✅ Store in `.env` (add to `.gitignore`)
- ✅ Use Personal Access Token with minimal permissions
- ✅ Required permissions: `repo` + `issues`
- ✅ Rotate tokens periodically

### GitHub Actions

- ✅ Uses repository-scoped `secrets.GITHUB_TOKEN`
- ✅ Automatically rotated by GitHub
- ✅ Limited to repository scope

### Environment Variables

```bash
# Never commit these:
.env
.env.local

# In CI/CD, use:
secrets.GITHUB_TOKEN
repository variables
```

---

## 🚨 Troubleshooting

### Issue: "GitHub token not configured"

**Check:**
```bash
echo $GITHUB_TOKEN
echo $GITHUB_REPOSITORY_OWNER
echo $GITHUB_REPOSITORY_NAME
```

**Solution:**
- Set environment variables
- Verify token starts with `ghp_`
- Check token has `repo` + `issues` permissions

### Issue: Issues not created

**Check:**
1. Environment variables set
2. Test actually failed (check logs)
3. `test-results/results.json` exists
4. GitHub API access working

**Debug:**
```bash
GITHUB_TOKEN=ghp_xxx npm test
# Should see "[GitHub Issue Reporter]" logs
```

### Issue: "Failed to create issue: 422"

**Check:**
- Title length < 256 characters
- Assignees exist in repository
- Labels are valid
- Body length reasonable

---

## 📊 Metrics & Monitoring

### Track Issue Creation

```bash
# View recent test failure issues
curl -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/your-org/your-repo/issues?labels=test-failure&state=open"
```

### Monitor Flaky Tests

Issues labeled with:
- `flaky-test` - Has retries
- `slow-test` - Duration > 30 seconds

### Key Metrics

- Issues created per day
- Flaky test count
- Most common failure types
- Time to create issue
- Test failure rate

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  GITHUB_REPOSITORY_OWNER: ${{ github.repository_owner }}
  GITHUB_REPOSITORY_NAME: ${{ github.event.repository.name }}
run: npm test
```

Workflow file: [.github/workflows/test-failure-issue-creation.yml](.github/workflows/test-failure-issue-creation.yml)

### Other CI/CD Systems

Works with:
- GitLab CI
- Jenkins
- CircleCI
- GitHub Actions
- Travis CI
- Any system that runs Node.js

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICK-START.md](QUICK-START.md) | Get started in 5 minutes |
| [GITHUB-ISSUES-SETUP.md](GITHUB-ISSUES-SETUP.md) | Comprehensive setup guide |
| [IMPLEMENTATION-REFERENCE.md](IMPLEMENTATION-REFERENCE.md) | Technical reference |
| [examples/github-issue-example.ts](examples/github-issue-example.ts) | Code examples |

---

## 🎨 Customization

### Add Custom Labels

Edit `github-issue-manager.ts`:
```typescript
private generateLabels(failureInfo: FailureInfo): string[] {
  const labels = ['test-failure'];
  
  if (failureInfo.errorMessage.includes('Timeout')) {
    labels.push('timeout-error');
  }
  
  return labels;
}
```

### Customize Issue Body

Edit `github-issue-manager.ts`:
```typescript
private generateIssueBody(failureInfo: FailureInfo): string {
  return `## Custom Format\n\n...`;
}
```

### Add Auto-Close Logic

Modify `process-test-failures.ts` to close issues when tests pass.

---

## 📦 Dependencies

### Core
- `@playwright/test` - Testing framework
- TypeScript (dev)

### Build Tools
- `esbuild-register` - Run TypeScript files directly

### Used in Examples
- `axios` (optional) - HTTP client

### Total Size
- ~50 KB for source code
- ~3 MB with dependencies (npm install)

---

## ✅ Requirements Met

Your requirements checklist:

- ✅ Detect test failures after Playwright test execution
- ✅ Extract failure details (test name, error, stack trace, browser)
- ✅ Use GitHub REST API to create issues
- ✅ Issue title format: "Test Failure: <test name> [<browser>]"
- ✅ Issue body includes all required information
- ✅ Avoid duplicates (search before creating)
- ✅ Auto-trigger in Playwright reporter
- ✅ GitHub Actions workflow included
- ✅ Environment variables for GitHub token
- ✅ Node.js/TypeScript compatible with Playwright
- ✅ Production-ready code with error handling
- ✅ Comprehensive documentation

---

## 🎯 Next Steps

1. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit with your GitHub token
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

4. **Check GitHub**
   - Go to your repository Issues tab
   - Should see new test failure issues

5. **Explore Examples**
   ```bash
   npm run examples
   ```

---

## 📞 Support

For detailed information:
- [QUICK-START.md](QUICK-START.md) - Quick setup
- [GITHUB-ISSUES-SETUP.md](GITHUB-ISSUES-SETUP.md) - Full guide
- [IMPLEMENTATION-REFERENCE.md](IMPLEMENTATION-REFERENCE.md) - Technical details
- [examples/](examples/) - Code examples

---

## 📄 License

Ready for production use. Customize as needed for your project.

---

## 🎉 Summary

You now have a complete, production-ready solution for:

1. **Automatic Test Failure Detection** via custom Playwright reporter
2. **GitHub Issue Creation** with rich failure details
3. **Duplicate Prevention** with smart issue searching
4. **CI/CD Integration** with GitHub Actions workflow
5. **Comprehensive Documentation** with examples and guides

**Get started in 3 steps:**
```bash
cp .env.example .env
npm install
npm test
```

Enjoy automatic issue tracking for your test failures! 🚀
