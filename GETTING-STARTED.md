# Getting Started Checklist

## 🎯 Setup in 3 Steps

### Step 1: Configure GitHub Token ✓

```bash
# Copy the template
cp .env.example .env

# Open the file and add your GitHub token
nano .env  # or use your preferred editor
```

**What to add:**
```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPOSITORY_OWNER=your-organization-name
GITHUB_REPOSITORY_NAME=your-repository-name
```

**How to get GitHub Token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scopes: `repo` and `issues`
4. Copy the token and paste in `.env`

### Step 2: Install Dependencies ✓

```bash
npm install
```

This installs all required packages including Playwright and TypeScript.

### Step 3: Verify Setup ✓

```bash
npm run verify
```

This checks that everything is configured correctly.

**Expected output:**
```
✅ Summary: XX/XX checks passed
✅ Setup is complete! Run tests with: npm test
```

---

## 🚀 Run Your First Test

```bash
npm test
```

When a test fails, a GitHub issue will be created automatically.

**Check it worked:**
1. Go to your GitHub repository
2. Click "Issues" tab
3. Look for issues labeled "test-failure"

---

## 📝 Verify Issue Was Created

### Issue Should Include

- ✓ Title: "Test Failure: [test name] [browser]"
- ✓ Test name and file path
- ✓ Browser name (chromium, firefox, webkit)
- ✓ Error message
- ✓ Full stack trace
- ✓ Timestamp
- ✓ Duration
- ✓ Labels: test-failure, browser-{name}

### Example Issue

```
Title: Test Failure: Login > should authenticate user [chromium]

Test Name: Login > should authenticate user
Browser: chromium
Test File: tests/login/auth.spec.ts
Timestamp: 5/5/2026, 2:30 PM
Duration: 30,000ms

Error: Timeout waiting for button
Stack Trace: ...
```

---

## 🧪 Test Different Scenarios

### Scenario 1: First Failure
```bash
npm test
```
Result: ✓ New issue created

### Scenario 2: Same Test Fails Again
```bash
npm test
```
Result: ✓ Comment added to existing issue (no duplicate)

### Scenario 3: Different Test Fails
```bash
npm test
```
Result: ✓ New issue created for different test

### Scenario 4: Multiple Browsers
```bash
npm test
```
Result: ✓ Separate issues for each browser failure

---

## 🔧 Available Commands

```bash
# Run tests with automatic issue creation
npm test

# Run tests without automatically creating issues (if GITHUB_TOKEN not set)
# Just set: unset GITHUB_TOKEN

# Run tests in headed mode (see the browser)
npm run test:headed

# Debug individual test
npm run test:debug

# Run UI mode (interactive)
npm run test:ui

# Run tests and explicitly process failures
npm run test:with-issues

# Process existing test results file
npm run process-failures

# Verify setup is correct
npm run verify

# View code examples
npm run examples
```

---

## ✅ Troubleshooting

### Problem: "GITHUB_TOKEN not configured"

**Solution:**
```bash
# Check if .env file exists
ls -la .env

# Check if GITHUB_TOKEN is set
echo $GITHUB_TOKEN

# If not set, edit .env and add it
nano .env
```

### Problem: Issues not being created

**Check 1: Environment variables**
```bash
echo $GITHUB_TOKEN | head -c 10
echo $GITHUB_REPOSITORY_OWNER
echo $GITHUB_REPOSITORY_NAME
```

**Check 2: Test actually failed**
```bash
npm test
# Look for [GitHub Issue Reporter] in output
```

**Check 3: GitHub API access**
```bash
# Verify token is valid
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

**Check 4: Run verification**
```bash
npm run verify
```

### Problem: "Failed to create issue: 422"

**Solution:**
- Check issue title length (< 256 chars)
- Check assignees exist in repository
- Check labels are valid
- Check body content

---

## 📚 Documentation Quick Links

| Need | Document | Time |
|------|----------|------|
| Quick setup | [QUICK-START.md](QUICK-START.md) | 5 min |
| Detailed guide | [GITHUB-ISSUES-SETUP.md](GITHUB-ISSUES-SETUP.md) | 20 min |
| Technical details | [IMPLEMENTATION-REFERENCE.md](IMPLEMENTATION-REFERENCE.md) | 30 min |
| Code examples | [examples/github-issue-example.ts](examples/github-issue-example.ts) | 10 min |
| File overview | [FILE-MANIFEST.md](FILE-MANIFEST.md) | 5 min |
| Main README | [README-GITHUB-ISSUES.md](README-GITHUB-ISSUES.md) | 10 min |

---

## 🎯 Next Steps

### Immediate (Done!)
- [x] Setup .env file
- [x] Install dependencies
- [x] Verify setup
- [x] Run first test

### Short Term
- [ ] Configure GitHub Actions workflow
- [ ] Push code to repository
- [ ] Test in CI/CD
- [ ] Monitor issue creation

### Future
- [ ] Customize issue labels
- [ ] Add team notifications
- [ ] Monitor flaky tests
- [ ] Auto-close fixed tests
- [ ] Create dashboard

---

## 💡 Pro Tips

### Tip 1: Use GitHub Actions

Push `.github/workflows/test-failure-issue-creation.yml` to create issues automatically in CI/CD.

### Tip 2: Batch Processing

If you have existing test results, process them:
```bash
npm run process-failures
```

### Tip 3: Verify First

Always run before the first time:
```bash
npm run verify
```

### Tip 4: View Examples

See different implementation patterns:
```bash
npm run examples
```

### Tip 5: Local Development

During development, you can disable issue creation:
```bash
unset GITHUB_TOKEN
npm test
# Issues won't be created, but tests will run normally
```

---

## 🔐 Security Reminders

⚠️ **IMPORTANT:**

- ✓ `.env` is in `.gitignore` - don't commit it
- ✓ Never share your GITHUB_TOKEN
- ✓ Token starts with `ghp_` or `github_pat_`
- ✓ Use minimal permissions (repo + issues)
- ✓ Rotate tokens regularly

**Check your .gitignore:**
```bash
cat .gitignore | grep .env
# Should show: .env
```

---

## 📞 Need Help?

### Quick Issues
- Check this checklist first
- Run `npm run verify`

### Setup Questions
- Read `QUICK-START.md`
- Read `GITHUB-ISSUES-SETUP.md`

### Technical Questions
- Read `IMPLEMENTATION-REFERENCE.md`
- Check code comments

### Code Examples
- Run `npm run examples`
- View `examples/github-issue-example.ts`

---

## ✨ You're All Set!

Your Playwright tests will now automatically create GitHub issues when they fail. 🎉

```bash
npm test
```

Go to your GitHub repository and check the Issues tab. Your first test failure should be there!

**Questions?** Check the documentation files or run `npm run verify` to diagnose any issues.
