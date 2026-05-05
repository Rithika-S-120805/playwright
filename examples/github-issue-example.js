require('dotenv').config();

const { GitHubIssueManager } = require('../src/utils/github-issue-manager.js');

async function example1_UsingIssueManager() {
  console.log('Example 1: Using GitHubIssueManager');

  const manager = new GitHubIssueManager({
    token: process.env.GITHUB_TOKEN,
    owner: 'my-org',
    repo: 'my-repo',
  });

  if (!manager.isConfigured()) {
    console.log('GitHub not configured. Set GITHUB_TOKEN environment variable.');
    return;
  }

  const failureInfo = {
    testName: 'Login > should authenticate with valid credentials',
    testPath: 'tests/login/auth.spec.ts',
    browser: 'chromium',
    errorMessage: 'Timeout waiting for selector "button[type="submit"]"',
    stackTrace: `Error: Timeout waiting for selector "button[type="submit"]"
  at Object.<anonymous> (node_modules/playwright/lib/utils/utils.js:123:45)
  at async loginPage.submitForm (tests/pages/login.ts:45:12)
  at async test (tests/login/auth.spec.ts:15:5)`,
    timestamp: new Date().toISOString(),
    duration: 30000,
    retries: 0,
  };

  try {
    const created = await manager.createIssueIfNotExists(failureInfo);
    console.log(`Issue creation result: ${created ? 'Created' : 'Already exists'}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function example2_UsingFetchDirectly() {
  console.log('Example 2: Using fetch directly');

  const token = process.env.GITHUB_TOKEN;
  const owner = 'my-org';
  const repo = 'my-repo';

  if (!token) {
    console.log('GITHUB_TOKEN not set');
    return;
  }

  const issueData = {
    title: 'Test Failure: Navigation should redirect to home page',
    body: `## Test Failure Report

**Test Name:** Navigation should redirect to home page

**Browser:** Firefox

**Error:**
\`\`\`
AssertionError: Expected URL to be 'http://localhost:3000/', but got 'http://localhost:3000/login'
\`\`\`

**Stack Trace:**
\`\`\`
at expect(...).toHaveURL (...)
at async test (tests/navigation.spec.ts:20:5)
\`\`\``,
    labels: ['test-failure', 'browser-firefox'],
    assignees: ['dev-lead', 'qa-engineer'],
  };

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      {
        method: 'POST',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issueData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('GitHub API error:', error);
      return;
    }

    const issue = await response.json();
    console.log(`Created issue #${issue.number}: ${issue.title}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function example3_BatchCreateIssues() {
  console.log('Example 3: Batch create issues');

  const manager = new GitHubIssueManager({
    token: process.env.GITHUB_TOKEN,
    owner: 'my-org',
    repo: 'my-repo',
  });

  const failures = [
    {
      testName: 'Checkout > should calculate total price correctly',
      testPath: 'tests/checkout.spec.ts',
      browser: 'chromium',
      errorMessage: 'Expected 49.99 to be 50.00',
      stackTrace: 'at expect(...).toBe (...)',
      timestamp: new Date().toISOString(),
      duration: 5000,
      retries: 0,
    },
    {
      testName: 'Payment > should process card payment',
      testPath: 'tests/payment.spec.ts',
      browser: 'firefox',
      errorMessage: 'Payment gateway timeout',
      stackTrace: 'at Object.<anonymous> (tests/payment.ts:45:12)',
      timestamp: new Date().toISOString(),
      duration: 30000,
      retries: 1,
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const failure of failures) {
    try {
      const result = await manager.createIssueIfNotExists(failure);
      if (result) {
        created++;
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(`Failed to create issue for ${failure.testName}:`, error);
    }
  }

  console.log(`Batch complete: ${created} created, ${skipped} skipped`);
}

async function example4_SearchExistingIssues() {
  console.log('Example 4: Search for existing issues');

  const token = process.env.GITHUB_TOKEN;
  const owner = 'my-org';
  const repo = 'my-repo';

  if (!token) {
    console.log('GITHUB_TOKEN not set');
    return;
  }

  try {
    const searchQuery = 'repo:my-org/my-repo in:title "Test Failure" state:open type:issue';

    const response = await fetch(
      `https://api.github.com/search/issues?q=${encodeURIComponent(searchQuery)}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      console.error('Search failed:', response.statusText);
      return;
    }

    const data = await response.json();
    console.log(`Found ${data.total_count} open test failure issues:`);

    data.items.forEach((issue) => {
      console.log(`  #${issue.number}: ${issue.title} (${issue.created_at})`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

async function example5_AddCommentToIssue() {
  console.log('Example 5: Add comment to existing issue');

  const token = process.env.GITHUB_TOKEN;
  const owner = 'my-org';
  const repo = 'my-repo';
  const issueNumber = 123;

  if (!token) {
    console.log('GITHUB_TOKEN not set');
    return;
  }

  const comment = `### New Failure Detected

**Time:** ${new Date().toLocaleString()}
**Browser:** Chrome
**Duration:** 5000ms

\`\`\`
AssertionError: Expected element to be visible
\`\`\``;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
      {
        method: 'POST',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: comment }),
      }
    );

    if (!response.ok) {
      console.error('Failed to add comment:', response.statusText);
      return;
    }

    console.log(`Added comment to issue #${issueNumber}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function example6_CloseIssue() {
  console.log('Example 6: Close issue');

  const token = process.env.GITHUB_TOKEN;
  const owner = 'my-org';
  const repo = 'my-repo';
  const issueNumber = 123;

  if (!token) {
    console.log('GITHUB_TOKEN not set');
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: 'closed',
          comment: 'Test is now passing. Closing this issue.',
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to close issue:', response.statusText);
      return;
    }

    console.log(`Closed issue #${issueNumber}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function example7_UsingAxios() {
  console.log('Example 7: Using axios (if installed)');

  try {
    const token = process.env.GITHUB_TOKEN;
    const owner = 'my-org';
    const repo = 'my-repo';

    if (!token) {
      console.log('GITHUB_TOKEN not set');
      return;
    }

    const axiosExample = `
    import axios from 'axios';

    const response = await axios.post(
      \`https://api.github.com/repos/\${owner}/\${repo}/issues\`,
      {
        title: 'Test Failure: ...',
        body: '...',
        labels: ['test-failure'],
      },
      {
        headers: {
          Authorization: \`token \${token}\`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    console.log(\`Created issue #\${response.data.number}\`);
    `;

    console.log(axiosExample);
  } catch (error) {
    console.error('Axios example requires axios to be installed');
  }
}

async function runExamples() {
  const examples = [
    example1_UsingIssueManager,
    example2_UsingFetchDirectly,
    example3_BatchCreateIssues,
    example4_SearchExistingIssues,
    example5_AddCommentToIssue,
    example6_CloseIssue,
    example7_UsingAxios,
  ];

  console.log('GitHub Issue Creation Examples\n');
  console.log('Environment check:');
  console.log(`  GITHUB_TOKEN: ${process.env.GITHUB_TOKEN ? '✓' : '✗'}`);
  console.log(`  GITHUB_REPOSITORY_OWNER: ${process.env.GITHUB_REPOSITORY_OWNER || '(not set)'}`);
  console.log(`  GITHUB_REPOSITORY_NAME: ${process.env.GITHUB_REPOSITORY_NAME || '(not set)'}\n`);

  for (const example of examples) {
    try {
      console.log('\n' + '='.repeat(60));
      await example();
    } catch (error) {
      console.error('Example error:', error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\nNote: These examples are for demonstration purposes.');
  console.log('Configure your GitHub token before running them.');
  console.log('\nFor more information, see GITHUB-ISSUES-SETUP.md');
}

if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = {
  example1_UsingIssueManager,
  example2_UsingFetchDirectly,
  example3_BatchCreateIssues,
  example4_SearchExistingIssues,
  example5_AddCommentToIssue,
  example6_CloseIssue,
  example7_UsingAxios,
};
