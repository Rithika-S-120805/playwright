const path = require('path');
const { GitHubIssueManager } = require('../utils/github-issue-manager.js');

class GitHubIssueReporter {
  constructor() {
    this.githubManager = new GitHubIssueManager({
      token: process.env.GITHUB_TOKEN,
      owner: process.env.GITHUB_REPOSITORY_OWNER || '',
      repo: process.env.GITHUB_REPOSITORY_NAME || '',
    });
    this.failedTests = new Map();
  }

  onTestEnd(test, result) {
    if (result.status === 'failed' || result.status === 'timedOut') {
      const failureInfo = this.extractFailureInfo(test, result);
      if (failureInfo) {
        this.failedTests.set(failureInfo.testName, failureInfo);
      }
    }
  }

  async onEnd() {
    if (this.failedTests.size === 0) {
      console.log(
        '[GitHub Issue Reporter] No failed tests, skipping issue creation'
      );
      return;
    }

    if (!this.githubManager.isConfigured()) {
      console.warn(
        '[GitHub Issue Reporter] GitHub token not configured. Set GITHUB_TOKEN environment variable to enable automatic issue creation.'
      );
      return;
    }

    console.log(
      `[GitHub Issue Reporter] Processing ${this.failedTests.size} failed test(s)`
    );

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

  extractFailureInfo(test, result) {
    if (!result.error) {
      return null;
    }

    const errorMessage = this.stripAnsi(result.error.message || 'Unknown error');
    const stackTrace = this.stripAnsi(
      result.error.stack || 'No stack trace available'
    );
    const browserName =
      result.projectName ||
      (typeof test.parent?.project === 'function'
        ? test.parent.project()?.name
        : undefined) ||
      'unknown';
    const testPath = test.location?.file
      ? path.relative(process.cwd(), test.location.file)
      : 'unknown';

    let parent = test.parent;
    const titleParts = [test.title];

    while (parent && parent.title) {
      titleParts.unshift(parent.title);
      parent = parent.parent;
    }

    return {
      testName: titleParts.join(' > '),
      testPath,
      browser: browserName,
      errorMessage,
      stackTrace,
      timestamp: new Date().toISOString(),
      duration: result.duration,
      retries: result.retry,
    };
  }

  stripAnsi(value) {
    // Remove terminal color/control codes from GitHub issue content.
    return value.replace(/\x1B\[[0-9;]*m/g, '');
  }
}

module.exports = GitHubIssueReporter;
module.exports.default = GitHubIssueReporter;
