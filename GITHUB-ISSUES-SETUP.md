# Automatic GitHub Issue Creation for Test Failures

This guide explains how to set up automatic GitHub issue creation when Playwright tests fail.

## Overview

The system consists of:
1. **Custom Playwright Reporter** - Detects test failures during test runs
2. **GitHub Issue Manager** - Handles issue creation and duplicate detection via GitHub API
3. **GitHub Actions Workflow** - Automates the process in CI/CD
4. **Test Failure Processor** - Standalone script for post-test processing

## Quick Start

### 1. Configuration

Set up the following environment variables:

```bash
# Required
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx         # GitHub Personal Access Token
GITHUB_REPOSITORY_OWNER=your-org-or-username          # Repository owner
GITHUB_REPOSITORY_NAME=your-repo-name                 # Repository name

# Optional
GITHUB_ISSUE_ASSIGNEES=user1,user2,user3              # Comma-separated GitHub usernames
```

**For GitHub Actions:**
1. Go to your repository Settings
2. Navigate to **Secrets and variables** > **Actions**
3. Create a new secret: `GITHUB_TOKEN` with your GitHub Personal Access Token
4. Create new variables for repository owner and name

**For local development:**
Create a `.env` file (add to `.gitignore`):
```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPOSITORY_OWNER=your-org
GITHUB_REPOSITORY_NAME=your-repo
GITHUB_ISSUE_ASSIGNEES=dev-team,qa-team
```

Load it in your test configuration:
```typescript
import dotenv from 'dotenv';
dotenv.config();
```

### 2. Setup Steps

#### Option A: Using Custom Reporter (Recommended)

**Step 1:** Update `playwright.config.ts` to use the custom reporter:

```typescript
import { defineConfig } from '@playwright/test';
import GitHubIssueReporter from './src/reporters/github-issue-reporter';

export default defineConfig({
  // ... other config
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
    [GitHubIssueReporter], // Add custom reporter
  ],
});
```

**Step 2:** Install dependencies:

```bash
npm install
```

**Step 3:** Run tests:

```bash
npm test
```

Failed tests will automatically trigger GitHub issue creation.

#### Option B: Using Post-Test Script

**Step 1:** Update `package.json` scripts:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:with-issues": "playwright test && node -r esbuild-register scripts/process-test-failures.ts"
  }
}
```

**Step 2:** Run tests with issue processing:

```bash
npm run test:with-issues
```

## GitHub Actions Integration

### Method 1: Dedicated Workflow

Create `.github/workflows/test-failure-issues.yml` (already included):

```yaml
name: Create Issues for Test Failures

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test-and-report:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      contents: read
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - run: npm install
      - run: npx playwright install
      
      - name: Run tests
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_REPOSITORY_OWNER: ${{ github.repository_owner }}
          GITHUB_REPOSITORY_NAME: ${{ github.event.repository.name }}
        run: npm test
        continue-on-error: true
      
      - name: Create issues for failures
        if: always()
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_REPOSITORY_OWNER: ${{ github.repository_owner }}
          GITHUB_REPOSITORY_NAME: ${{ github.event.repository.name }}
        run: node -r esbuild-register scripts/process-test-failures.ts
```

### Method 2: Existing Workflow Integration

Add to your existing test workflow:

```yaml
- name: Create issues for test failures
  if: always()
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    GITHUB_REPOSITORY_OWNER: ${{ github.repository_owner }}
    GITHUB_REPOSITORY_NAME: ${{ github.event.repository.name }}
  run: npm run test:with-issues
```

## Features

### Automatic Duplicate Detection

When a test fails multiple times:
- First failure: Creates a new GitHub issue
- Subsequent failures: Adds comments to existing issue instead of creating duplicates
- Searches for open issues with matching test name and browser

### Issue Labels

Issues are automatically labeled with:
- `test-failure` - All test failures
- `browser-{name}` - Browser-specific label (e.g., `browser-chromium`)
- `flaky-test` - If test has retries
- `slow-test` - If test takes >30 seconds

### Custom Assignees

Set `GITHUB_ISSUE_ASSIGNEES` environment variable to auto-assign issues:

```bash
export GITHUB_ISSUE_ASSIGNEES=alice,bob,charlie
```

### Detailed Issue Information

Each issue includes:
- Test name and file path
- Browser/environment
- Complete error message
- Full stack trace
- Timestamp and duration
- Retry count
- Steps to reproduce

## API Reference

### GitHubIssueManager

```typescript
import { GitHubIssueManager } from './src/utils/github-issue-manager';

const manager = new GitHubIssueManager({
  token: process.env.GITHUB_TOKEN,
  owner: 'your-org',
  repo: 'your-repo',
});

// Create issue if it doesn't exist
const created = await manager.createIssueIfNotExists({
  testName: 'Login > should authenticate user',
  testPath: 'tests/login.spec.ts',
  browser: 'chromium',
  errorMessage: 'Timeout waiting for selector',
  stackTrace: '...',
  timestamp: new Date().toISOString(),
  duration: 5000,
  retries: 0,
});
```

### Custom Reporter

```typescript
import { GitHubIssueReporter } from './src/reporters/github-issue-reporter';

export default defineConfig({
  reporter: [
    [GitHubIssueReporter],
  ],
});
```

## Example: Manual API Call

```typescript
import fetch from 'node-fetch';

const createGitHubIssue = async (
  owner: string,
  repo: string,
  token: string,
  title: string,
  body: string
) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`,
    {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        labels: ['test-failure'],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create issue: ${response.statusText}`);
  }

  return response.json();
};

// Usage
await createGitHubIssue(
  'my-org',
  'my-repo',
  process.env.GITHUB_TOKEN,
  'Test Failure: Login should authenticate user',
  `## Error\n\nTimeout waiting for element`
);
```

## Troubleshooting

### "GitHub token not configured"

**Problem:** Issues aren't being created even though tests are failing.

**Solution:**
1. Verify `GITHUB_TOKEN` environment variable is set
2. Check token has `repo` and `issues:write` permissions
3. Ensure `GITHUB_REPOSITORY_OWNER` and `GITHUB_REPOSITORY_NAME` are set

```bash
echo $GITHUB_TOKEN
echo $GITHUB_REPOSITORY_OWNER
echo $GITHUB_REPOSITORY_NAME
```

### "GitHub API error: 422"

**Problem:** Validation failed when creating issue.

**Solution:**
1. Check issue title length (should be <256 characters)
2. Verify assignees exist in the repository
3. Check label names are valid

### "Failed to search for existing issues"

**Problem:** Duplicate detection isn't working.

**Solution:**
1. Verify token has search permissions
2. Check repository is public or token has proper access
3. Review GitHub API search limits (60 requests/hour for authenticated users)

### Tests pass but no issues created

**Problem:** Failed tests exist but no GitHub issues appear.

**Solution:**
1. Check test results file exists: `test-results/results.json`
2. Verify reporter is configured in `playwright.config.ts`
3. Check logs for error messages
4. Ensure GitHub configuration environment variables are set

## Performance Considerations

- **Issue Creation:** ~1-2 seconds per issue (API latency)
- **Duplicate Detection:** ~0.5-1 second per test (search API call)
- **Batch Processing:** Process multiple failures sequentially to respect API rate limits

For high-volume test suites, consider:
1. Batching issue creation in CI/CD
2. Using a queue system for rate-limited API calls
3. Implementing issue deduplication cache

## Security

### GitHub Token Best Practices

1. **Use Personal Access Token (PAT)** with minimal permissions:
   - `repo` - Full control of private repositories
   - `issues` - Read and write access to issues

2. **Use GitHub Actions Token** in workflows:
   - Automatically available as `secrets.GITHUB_TOKEN`
   - Scoped to the repository
   - Short-lived

3. **Never commit tokens** to version control:
   ```bash
   echo "GITHUB_TOKEN=*" >> .gitignore
   ```

4. **Rotate tokens regularly:**
   - Delete old tokens from GitHub settings
   - Create new ones periodically

## Related Files

- [Custom Reporter](./src/reporters/github-issue-reporter.ts) - Playwright reporter implementation
- [GitHub Issue Manager](./src/utils/github-issue-manager.ts) - Issue creation logic
- [GitHub Actions Workflow](./.github/workflows/test-failure-issue-creation.yml) - CI/CD integration
- [Test Failure Processor](./scripts/process-test-failures.ts) - Standalone processing script

## Advanced Configuration

### Custom Labels

Modify `generateLabels()` in `github-issue-manager.ts` to add custom labels based on error patterns:

```typescript
private generateLabels(failureInfo: FailureInfo): string[] {
  const labels = ['test-failure', `browser-${failureInfo.browser}`];
  
  if (failureInfo.errorMessage.includes('Timeout')) {
    labels.push('timeout-error');
  }
  
  return labels;
}
```

### Custom Issue Template

Modify `generateIssueBody()` to customize the issue body format and include additional information.

### Webhook Integration

Use GitHub webhooks to trigger actions when issues are created (e.g., Slack notifications):

```bash
POST https://your-webhook-url.com/github-issues
Content-Type: application/json
Authorization: Bearer YOUR_SECRET

{
  "action": "opened",
  "issue": {
    "number": 123,
    "title": "Test Failure: ...",
    "body": "..."
  }
}
```

## Support & Feedback

For issues, improvements, or questions about this implementation, refer to the test failure documentation or GitHub Issues in the repository.
