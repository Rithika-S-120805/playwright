/**
 * Custom Playwright Reporter for creating GitHub issues on test failures
 * Detects test failures and automatically creates GitHub issues with extracted failure details
 */

import {
  Reporter,
  TestCase,
  TestResult,
  FullResult,
  Suite,
} from '@playwright/test/reporter';
import { GitHubIssueManager } from '../utils/github-issue-manager';
import path from 'path';

interface FailedTestInfo {
  testName: string;
  testPath: string;
  browser: string;
  errorMessage: string;
  stackTrace: string;
  timestamp: string;
  duration: number;
  retries: number;
}

export class GitHubIssueReporter implements Reporter {
  private githubManager: GitHubIssueManager;
  private failedTests: Map<string, FailedTestInfo> = new Map();

  constructor() {
    this.githubManager = new GitHubIssueManager({
      token: process.env.GITHUB_TOKEN,
      owner: process.env.GITHUB_REPOSITORY_OWNER || '',
      repo: process.env.GITHUB_REPOSITORY_NAME || '',
    });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    // Check if test failed
    if (result.status === 'failed' || result.status === 'timedOut') {
      const failureInfo = this.extractFailureInfo(test, result);
      if (failureInfo) {
        this.failedTests.set(failureInfo.testName, failureInfo);
      }
    }
  }

  async onEnd(_result: FullResult): Promise<void> {
    // Only process if there are failed tests
    if (this.failedTests.size === 0) {
      console.log(
        '[GitHub Issue Reporter] No failed tests, skipping issue creation'
      );
      return;
    }

    // Validate GitHub configuration
    if (!this.githubManager.isConfigured()) {
      console.warn(
        '[GitHub Issue Reporter] GitHub token not configured. Set GITHUB_TOKEN environment variable to enable automatic issue creation.'
      );
      return;
    }

    console.log(
      `[GitHub Issue Reporter] Processing ${this.failedTests.size} failed test(s)`
    );

    // Create issues for each failed test
    for (const [testName, failureInfo] of this.failedTests) {
      try {
        const issueCreated = await this.githubManager.createIssueIfNotExists(
          failureInfo
        );

        if (issueCreated) {
          console.log(
            `[GitHub Issue Reporter] Created GitHub issue for: ${testName}`
          );
        } else {
          console.log(
            `[GitHub Issue Reporter] Issue already exists for: ${testName}`
          );
        }
      } catch (error) {
        console.error(
          `[GitHub Issue Reporter] Failed to create issue for ${testName}:`,
          error
        );
      }
    }
  }

  private extractFailureInfo(
    test: TestCase,
    result: TestResult
  ): FailedTestInfo | null {
    if (!result.error) {
      return null;
    }

    const errorMessage = this.stripAnsi(result.error.message || 'Unknown error');
    const stackTrace = this.stripAnsi(
      result.error.stack || 'No stack trace available'
    );

    // Extract browser name from test project
    const browserName =
      (result as TestResult & { projectName?: string }).projectName ||
      (typeof (test.parent as Suite & { project?: () => { name?: string } }).project ===
      'function'
        ? (test.parent as Suite & { project: () => { name?: string } }).project()
            ?.name
        : undefined) ||
      'unknown';

    // Extract relative test path
    const testPath = test.location?.file
      ? path.relative(process.cwd(), test.location.file)
      : 'unknown';

    // Build full test name with parent suite info
    let fullTestName = test.title;
    let parent: Suite | undefined = test.parent;
    const titleParts: string[] = [test.title];

    while (parent && parent.title) {
      titleParts.unshift(parent.title);
      parent = parent.parent;
    }

    fullTestName = titleParts.join(' > ');

    return {
      testName: fullTestName,
      testPath,
      browser: browserName,
      errorMessage,
      stackTrace,
      timestamp: new Date().toISOString(),
      duration: result.duration,
      retries: result.retry,
    };
  }

  private stripAnsi(value: string): string {
    // Remove terminal color/control codes from GitHub issue content.
    return value.replace(/\x1B\[[0-9;]*m/g, '');
  }
}

export default GitHubIssueReporter;
