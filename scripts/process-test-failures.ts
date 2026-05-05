/**
 * Script to process Playwright test results and create GitHub issues for failures
 * Can be run independently or as part of CI/CD pipeline
 */

import fs from 'fs';
import path from 'path';
import { GitHubIssueManager } from '../src/utils/github-issue-manager';

interface PlaywrightTestResult {
  name: string;
  tests: Array<{
    name: string;
    file: string;
    ok: boolean;
    duration: number;
    results: Array<{
      status: 'passed' | 'failed' | 'timedOut';
      duration: number;
      error?: {
        message: string;
        stack: string;
      };
      retry: number;
    }>;
  }>;
  suites?: Array<{
    file: string;
    tests?: Array<{
      name: string;
      title: string;
      ok: boolean;
      error?: {
        message: string;
        stack: string;
      };
      results?: Array<{
        duration: number;
        error?: {
          message: string;
          stack: string;
        };
        retry: number;
      }>;
    }>;
  }>;
}

async function processTestFailures(): Promise<void> {
  try {
    console.log('[Process Test Failures] Starting test failure processing...');

    // Validate GitHub configuration
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_REPOSITORY_OWNER;
    const repo = process.env.GITHUB_REPOSITORY_NAME;

    if (!token || !owner || !repo) {
      console.warn(
        '[Process Test Failures] Missing GitHub configuration:',
        {
          hasToken: !!token,
          hasOwner: !!owner,
          hasRepo: !!repo,
        }
      );
      console.log('[Process Test Failures] Skipping issue creation');
      return;
    }

    // Find test results file
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

    // Extract failures
    const failures = extractFailures(testResults);
    console.log(
      `[Process Test Failures] Found ${failures.length} failed test(s)`
    );

    if (failures.length === 0) {
      console.log('[Process Test Failures] No test failures to report');
      return;
    }

    // Create GitHub issues
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

function findResultsFile(): string | null {
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

function readTestResults(filePath: string): PlaywrightTestResult | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('[Process Test Failures] Error reading test results:', error);
    return null;
  }
}

function extractFailures(
  results: PlaywrightTestResult
): Array<{
  testName: string;
  testPath: string;
  browser: string;
  errorMessage: string;
  stackTrace: string;
  timestamp: string;
  duration: number;
  retries: number;
}> {
  const failures: Array<{
    testName: string;
    testPath: string;
    browser: string;
    errorMessage: string;
    stackTrace: string;
    timestamp: string;
    duration: number;
    retries: number;
  }> = [];

  // Handle Playwright JSON reporter format
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

// Run the script
processTestFailures().catch((error) => {
  console.error('[Process Test Failures] Fatal error:', error);
  process.exit(1);
});
