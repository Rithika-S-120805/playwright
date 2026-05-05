require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { GitHubIssueManager } = require('../src/utils/github-issue-manager.js');

async function processTestFailures() {
  try {
    console.log('[Process Test Failures] Starting test failure processing...');

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_REPOSITORY_OWNER;
    const repo = process.env.GITHUB_REPOSITORY_NAME;

    if (!token || !owner || !repo) {
      console.warn('[Process Test Failures] Missing GitHub configuration:', {
        hasToken: !!token,
        hasOwner: !!owner,
        hasRepo: !!repo,
      });
      console.log('[Process Test Failures] Skipping issue creation');
      return;
    }

    const resultsFile = findResultsFile();
    if (!resultsFile) {
      console.warn('[Process Test Failures] No test results file found');
      return;
    }

    console.log(`[Process Test Failures] Reading results from: ${resultsFile}`);
    const testResults = readTestResults(resultsFile);

    if (!testResults) {
      console.warn('[Process Test Failures] No test results to process');
      return;
    }

    const failures = extractFailures(testResults);
    console.log(`[Process Test Failures] Found ${failures.length} failed test(s)`);

    if (failures.length === 0) {
      console.log('[Process Test Failures] No test failures to report');
      return;
    }

    const issueManager = new GitHubIssueManager({ token, owner, repo });

    let createdCount = 0;
    let skippedCount = 0;

    for (const failure of failures) {
      try {
        const created = await issueManager.createIssueIfNotExists(failure);
        if (created) {
          createdCount++;
        } else {
          skippedCount++;
        }
      } catch (error) {
        console.error(
          `[Process Test Failures] Failed to create issue for ${failure.testName}:`,
          error
        );
      }
    }

    console.log(
      `[Process Test Failures] Complete: ${createdCount} created, ${skippedCount} skipped`
    );
  } catch (error) {
    console.error('[Process Test Failures] Unexpected error:', error);
    process.exit(1);
  }
}

function findResultsFile() {
  const possiblePaths = [
    'test-results/results.json',
    './test-results/results.json',
    path.join(process.cwd(), 'test-results', 'results.json'),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
}

function readTestResults(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('[Process Test Failures] Error reading test results:', error);
    return null;
  }
}

function extractFailures(results) {
  const failures = [];

  if (results.suites) {
    for (const suite of results.suites) {
      if (suite.tests) {
        for (const test of suite.tests) {
          if (!test.ok && test.error) {
            const browserMatch = suite.file?.match(/\[([^\]]+)\]/);
            const browser = browserMatch ? browserMatch[1] : 'unknown';

            failures.push({
              testName: test.title || test.name,
              testPath: suite.file || 'unknown',
              browser,
              errorMessage: test.error.message,
              stackTrace: test.error.stack || 'No stack trace available',
              timestamp: new Date().toISOString(),
              duration: test.results?.[0]?.duration || 0,
              retries: test.results?.[0]?.retry || 0,
            });
          }
        }
      }
    }
  }

  return failures;
}

processTestFailures().catch((error) => {
  console.error('[Process Test Failures] Fatal error:', error);
  process.exit(1);
});
