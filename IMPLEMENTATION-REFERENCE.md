# GitHub Issue Creation Integration - Complete Reference

## Components Overview

### 1. Custom Playwright Reporter
**File:** [src/reporters/github-issue-reporter.ts](src/reporters/github-issue-reporter.ts)

- Implements Playwright's `Reporter` interface
- Listens for test failures (`onTestEnd` hook)
- Extracts failure details automatically
- Delegates issue creation to `GitHubIssueManager`

**Key Methods:**
```typescript
onTestEnd(test: TestCase, result: TestResult) // Called after each test
onEnd(result: FullResult)                       // Called after all tests
extractFailureInfo()                            // Parse test error details
```

### 2. GitHub Issue Manager
**File:** [src/utils/github-issue-manager.ts](src/utils/github-issue-manager.ts)

- Handles GitHub REST API interactions
- Creates issues with formatted content
- Detects and prevents duplicates
- Adds comments to existing issues

**Key Methods:**
```typescript
createIssueIfNotExists(failureInfo)  // Main entry point
findExistingIssue(title)              // Search for open issues
createIssue(title, body)              // Create new GitHub issue
updateIssueWithFailure(issueNumber)   // Add failure comment
generateLabels(failureInfo)           // Auto-generate issue labels
```

### 3. GitHub Actions Workflow
**File:** [.github/workflows/test-failure-issue-creation.yml](.github/workflows/test-failure-issue-creation.yml)

Two approaches:
- **Approach 1:** Custom reporter in same workflow run
- **Approach 2:** Separate workflow triggered by test failures

### 4. Test Failure Processor
**File:** [scripts/process-test-failures.ts](scripts/process-test-failures.ts)

- Standalone script for post-test processing
- Reads Playwright JSON results
- Creates issues without running tests again
- Useful for CI/CD integration

### 5. Documentation
- **[GITHUB-ISSUES-SETUP.md](GITHUB-ISSUES-SETUP.md)** - Comprehensive setup guide
- **[QUICK-START.md](QUICK-START.md)** - 5-minute quick start
- **[examples/github-issue-example.ts](examples/github-issue-example.ts)** - 7 usage examples

---

## Data Flow

### During Test Execution

```
1. npm test
2. Playwright runs tests
3. GitHubIssueReporter.onTestEnd() for each test
4. If test fails:
   - Extract failure details
   - Store in failedTests map
5. GitHubIssueReporter.onEnd() after all tests
6. For each failed test:
   - GitHubIssueManager.createIssueIfNotExists()
   - Search for existing issue
   - Create new or add comment
```

### Failure Information Extracted

```
{
  testName: "Login > should authenticate",           // Full test path
  testPath: "tests/login/auth.spec.ts",             // File path
  browser: "chromium",                               // Browser name
  errorMessage: "Timeout waiting for button",        // Error text
  stackTrace: "Error: ...\n at ...",                // Full stack
  timestamp: "2026-05-05T14:30:00.000Z",           // When it failed
  duration: 30000,                                   // Test duration (ms)
  retries: 0                                         // Retry count
}
```

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | ✓ | GitHub Personal Access Token |
| `GITHUB_REPOSITORY_OWNER` | ✓ | Repository owner/org name |
| `GITHUB_REPOSITORY_NAME` | ✓ | Repository name |
| `GITHUB_ISSUE_ASSIGNEES` | ✗ | Comma-separated usernames |
| `CI` | ✗ | Set by GitHub Actions |
| `NODE_ENV` | ✗ | development/production |

### Playwright Config

```typescript
export default defineConfig({
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
    [GitHubIssueReporter], // ← Add custom reporter
  ],
});
```

### Package Scripts

```json
{
  "scripts": {
    "test": "playwright test",                    // Run tests
    "test:headed": "playwright test --headed",    // Visible browser
    "test:with-issues": "playwright test && npm run process-failures", // Test + issues
    "process-failures": "node -r esbuild-register scripts/process-test-failures.ts",
    "examples": "node -r esbuild-register examples/github-issue-example.ts"
  }
}
```

---

## GitHub API Integration

### Create Issue Request

```http
POST /repos/{owner}/{repo}/issues
Authorization: token {GITHUB_TOKEN}
Content-Type: application/json

{
  "title": "Test Failure: Login should authenticate [chromium]",
  "body": "## Test Failure Report\n\n...",
  "labels": ["test-failure", "browser-chromium"],
  "assignees": ["dev-lead", "qa-engineer"]
}
```

### Search for Existing Issues

```http
GET /search/issues?q=repo:{owner}/{repo}+in:title+"Test+Failure:+Login"+state:open+type:issue
Authorization: token {GITHUB_TOKEN}
```

### Add Comment to Issue

```http
POST /repos/{owner}/{repo}/issues/{issue_number}/comments
Authorization: token {GITHUB_TOKEN}
Content-Type: application/json

{
  "body": "### New Failure Detected\n\n..."
}
```

---

## Implementation Examples

### 1. Basic Setup (5 minutes)

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with your GitHub token

# 2. Install dependencies
npm install

# 3. Run tests
npm test
```

### 2. GitHub Actions

```yaml
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  GITHUB_REPOSITORY_OWNER: ${{ github.repository_owner }}
  GITHUB_REPOSITORY_NAME: ${{ github.event.repository.name }}
run: npm test
```

### 3. Manual Issue Creation

```typescript
import { GitHubIssueManager } from './src/utils/github-issue-manager';

const manager = new GitHubIssueManager({
  token: process.env.GITHUB_TOKEN,
  owner: 'my-org',
  repo: 'my-repo',
});

await manager.createIssueIfNotExists({
  testName: 'Example test',
  testPath: 'tests/example.ts',
  browser: 'chromium',
  errorMessage: 'AssertionError: ...',
  stackTrace: '...',
  timestamp: new Date().toISOString(),
  duration: 5000,
  retries: 0,
});
```

### 4. Using Fetch API Directly

```typescript
const response = await fetch(
  'https://api.github.com/repos/my-org/my-repo/issues',
  {
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Test Failure: ...',
      body: '## Error\n\n...',
      labels: ['test-failure'],
    }),
  }
);
```

### 5. Post-Test Processing

```bash
# After tests complete
npm run process-failures

# Or in CI/CD
if [ -f test-results/results.json ]; then
  node -r esbuild-register scripts/process-test-failures.ts
fi
```

---

## Error Handling

### Common Issues & Solutions

#### Issue 1: "GitHub token not configured"
```
Solution:
1. Set GITHUB_TOKEN environment variable
2. Verify token starts with 'ghp_'
3. Check token has repo and issues permissions
```

#### Issue 2: "Failed to create issue: 422"
```
Solution:
1. Verify assignee usernames exist
2. Check issue title length < 256 chars
3. Verify labels are valid
4. Check repository access
```

#### Issue 3: "Rate limit exceeded"
```
Solution:
1. Wait for rate limit to reset (1 hour)
2. Use authenticated requests (higher limit)
3. Batch process failures offline
4. Use organization token instead
```

#### Issue 4: "Duplicate issues not detected"
```
Solution:
1. Check search query syntax
2. Verify GitHub token has search permissions
3. Check existing issues are "open" state
4. Review issue title formatting
```

---

## Performance Considerations

### Latency per Operation

| Operation | Time | Notes |
|-----------|------|-------|
| Create issue | 1-2s | API call + validation |
| Search issues | 0.5-1s | Query + pagination |
| Add comment | 0.5-1s | API call |
| Batch (10 issues) | 15-20s | Sequential processing |

### Rate Limits

- **Authenticated:** 5,000 requests/hour
- **Search:** 30 requests/minute
- **Per-resource:** Check X-RateLimit headers

### Optimization Tips

1. **Batch failures:** Process multiple at once
2. **Cache searches:** Remember existing issues in same run
3. **Use queue:** Process in background during test run
4. **Deduplicate:** Check locally before API calls

---

## Security Best Practices

### Token Management

✅ **DO:**
- Store token in `.env` (add to `.gitignore`)
- Use GitHub Actions secrets
- Rotate tokens periodically
- Use minimal permission scopes
- Use organization tokens when possible

❌ **DON'T:**
- Commit tokens to version control
- Pass tokens in URLs
- Hardcode tokens in source
- Use personal tokens for automation
- Log tokens in CI/CD output

### GitHub Actions Permissions

```yaml
permissions:
  issues: write           # Create/update issues
  repository-projects: write
  contents: read          # Read repository
  actions: read           # Optional
```

---

## Testing & Validation

### Local Testing

```bash
# Set test token
export GITHUB_TOKEN=ghp_test_token
export GITHUB_REPOSITORY_OWNER=test-org
export GITHUB_REPOSITORY_NAME=test-repo

# Run tests
npm test

# Process failures
npm run process-failures
```

### CI/CD Testing

```bash
# In GitHub Actions
- name: Test with issue creation
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: npm test
```

### Validation Checklist

- [ ] Environment variables set correctly
- [ ] GitHub token has required permissions
- [ ] Reporter imported in playwright.config.ts
- [ ] Test results file generated
- [ ] Issues created in GitHub
- [ ] Duplicate prevention working
- [ ] Comments added to existing issues
- [ ] Labels applied correctly

---

## Maintenance & Updates

### Monitoring

Track issue creation:
```bash
# Check recent issues
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/my-org/my-repo/issues?state=open&labels=test-failure
```

### Metrics to Monitor

- Issues created per day
- Flaky test patterns (retries)
- Most common failure types
- Test failure rate
- Time to detect failures

### Updating

Keep components updated:
```bash
npm update
npm audit fix
```

---

## Integration with CI/CD Systems

### GitHub Actions (Native)

[.github/workflows/test-failure-issue-creation.yml](./.github/workflows/test-failure-issue-creation.yml)

### GitLab CI

```yaml
test:
  script:
    - npm test
  after_script:
    - npm run process-failures
  only:
    - merge_requests
```

### Jenkins

```groovy
stage('Test') {
  steps {
    sh 'npm test'
    sh 'npm run process-failures'
  }
}
```

### CircleCI

```yaml
jobs:
  test:
    steps:
      - run: npm test
      - run: npm run process-failures
```

---

## FAQ

**Q: Can I disable issue creation?**
A: Yes, don't set GITHUB_TOKEN environment variable.

**Q: Do duplicate checks happen offline?**
A: No, they use GitHub API search (1 call per failed test).

**Q: Can I customize issue labels?**
A: Yes, modify `generateLabels()` in `github-issue-manager.ts`.

**Q: What if test passes after failing?**
A: Modify `process-test-failures.ts` to close issues.

**Q: Can I test without creating real issues?**
A: Use GitHub's GraphQL API in dry-run mode or test repo.

---

## Resource Links

- [Playwright Reporter API](https://playwright.dev/docs/test-reporters)
- [GitHub REST API](https://docs.github.com/en/rest)
- [GitHub Actions](https://docs.github.com/en/actions)
- [GitHub Issues API](https://docs.github.com/en/rest/issues)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## Version History

**v1.0.0** (Current)
- Initial release
- Custom Playwright reporter
- GitHub Issue Manager utility
- GitHub Actions workflow
- CLI scripts for processing failures

---

## License & Support

For issues, questions, or improvements, refer to the repository documentation or GitHub Issues.
