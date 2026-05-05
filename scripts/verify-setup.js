#!/usr/bin/env node

require('dotenv').config();

const fs = require('fs');
const path = require('path');

class SetupVerifier {
  constructor() {
    this.results = [];
    this.projectRoot = process.cwd();
  }

  async verify() {
    console.log('\n🔍 GitHub Issue Reporter - Setup Verification\n');
    console.log('='.repeat(60));

    await this.checkEnvironmentVariables();
    await this.checkFileStructure();
    await this.checkConfiguration();
    await this.checkDependencies();
    await this.checkGitHubToken();

    this.displayResults();
  }

  async checkEnvironmentVariables() {
    console.log('\n📋 Checking Environment Variables...');

    const requiredVars = [
      'GITHUB_TOKEN',
      'GITHUB_REPOSITORY_OWNER',
      'GITHUB_REPOSITORY_NAME',
    ];

    for (const varName of requiredVars) {
      const value = process.env[varName];
      const isSet = !!value;
      const maskedValue = value
        ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}`
        : 'NOT SET';

      this.results.push({
        name: `Environment: ${varName}`,
        passed: true,
        message: isSet ? `✓ Set to: ${maskedValue}` : `⚠ Not set (optional for local runs)`,
        severity: isSet ? 'info' : 'warning',
      });
    }

    const optionalVars = ['GITHUB_ISSUE_ASSIGNEES', 'CI', 'NODE_ENV'];
    for (const varName of optionalVars) {
      const value = process.env[varName];
      this.results.push({
        name: `Environment: ${varName} (optional)`,
        passed: true,
        message: value ? `✓ Set to: ${value}` : '(not set)',
        severity: 'info',
      });
    }
  }

  async checkFileStructure() {
    console.log('\n📁 Checking File Structure...');

    const requiredFiles = [
      'src/reporters/github-issue-reporter.js',
      'src/utils/github-issue-manager.js',
      'scripts/process-test-failures.js',
      'scripts/verify-setup.js',
      'playwright.config.ts',
      'package.json',
    ];

    const optionalFiles = [
      '.env',
      '.github/workflows/test-failure-issue-creation.yml',
      'tsconfig.json',
      'examples/github-issue-example.js',
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(this.projectRoot, file);
      const exists = fs.existsSync(filePath);

      this.results.push({
        name: `File: ${file}`,
        passed: exists,
        message: exists ? '✓ Found' : '✗ Missing',
        severity: exists ? 'info' : 'error',
      });
    }

    for (const file of optionalFiles) {
      const filePath = path.join(this.projectRoot, file);
      const exists = fs.existsSync(filePath);

      this.results.push({
        name: `File: ${file} (optional)`,
        passed: true,
        message: exists ? '✓ Found' : '(not found)',
        severity: 'info',
      });
    }
  }

  async checkConfiguration() {
    console.log('\n⚙️  Checking Configuration...');

    try {
      const configPath = path.join(this.projectRoot, 'playwright.config.ts');
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf-8');
        const hasReporter = content.includes('github-issue-reporter.js');
        const hasImport = content.includes('github-issue-reporter.js');

        this.results.push({
          name: 'Config: Reporter imported',
          passed: true,
          message: hasImport
            ? '✓ GitHubIssueReporter JS reporter configured'
            : '⚠ Reporter import not detected',
          severity: hasImport ? 'info' : 'warning',
        });

        this.results.push({
          name: 'Config: Reporter registered',
          passed: hasReporter,
          message: hasReporter
            ? '✓ GitHubIssueReporter in reporter array'
            : '✗ Not registered in reporters',
          severity: hasReporter ? 'info' : 'error',
        });
      }
    } catch (error) {
      this.results.push({
        name: 'Config: playwright.config.ts',
        passed: false,
        message: `✗ Error reading config: ${error}`,
        severity: 'error',
      });
    }

    try {
      const packagePath = path.join(this.projectRoot, 'package.json');
      if (fs.existsSync(packagePath)) {
        const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
        const hasTestScript = content.scripts?.test;
        const hasProcessScript = content.scripts?.['process-failures'];

        this.results.push({
          name: 'Config: npm test script',
          passed: !!hasTestScript,
          message: hasTestScript ? '✓ test script found' : '✗ test script missing',
          severity: hasTestScript ? 'info' : 'error',
        });

        this.results.push({
          name: 'Config: npm run process-failures',
          passed: !!hasProcessScript,
          message: hasProcessScript
            ? '✓ process-failures script found'
            : '(optional)',
          severity: 'info',
        });
      }
    } catch (error) {
      this.results.push({
        name: 'Config: package.json',
        passed: false,
        message: `✗ Error reading package.json: ${error}`,
        severity: 'error',
      });
    }
  }

  async checkDependencies() {
    console.log('\n📦 Checking Dependencies...');

    try {
      const packagePath = path.join(this.projectRoot, 'package.json');
      if (fs.existsSync(packagePath)) {
        const content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
        const deps = {
          ...content.dependencies,
          ...content.devDependencies,
        };

        const requiredDeps = ['@playwright/test', '@types/node', 'typescript'];

        for (const dep of requiredDeps) {
          const version = deps[dep];

          this.results.push({
            name: `Dependency: ${dep}`,
            passed: !!version,
            message: version ? `✓ Installed: ${version}` : '✗ Not found',
            severity: version ? 'info' : 'error',
          });
        }

        const nodeModulesPath = path.join(this.projectRoot, 'node_modules');
        const isInstalled = fs.existsSync(nodeModulesPath);

        this.results.push({
          name: 'Dependencies: npm modules installed',
          passed: isInstalled,
          message: isInstalled ? '✓ node_modules found' : '✗ Run: npm install',
          severity: isInstalled ? 'info' : 'warning',
        });
      }
    } catch (error) {
      this.results.push({
        name: 'Dependencies: package.json',
        passed: false,
        message: `✗ Error: ${error}`,
        severity: 'error',
      });
    }
  }

  async checkGitHubToken() {
    console.log('\n🔑 Checking GitHub Token...');

    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      this.results.push({
        name: 'GitHub: Token exists',
        passed: true,
        message: '⚠ GITHUB_TOKEN not set (issue creation disabled locally)',
        severity: 'warning',
      });
      return;
    }

    this.results.push({
      name: 'GitHub: Token exists',
      passed: true,
      message: '✓ GITHUB_TOKEN is set',
      severity: 'info',
    });

    const isValidFormat = token.startsWith('ghp_') || token.startsWith('github_pat_');

    this.results.push({
      name: 'GitHub: Token format',
      passed: true,
      message: isValidFormat ? '✓ Token format is valid' : '⚠️ Token format may be invalid',
      severity: isValidFormat ? 'info' : 'warning',
    });

    const owner = process.env.GITHUB_REPOSITORY_OWNER;
    const repo = process.env.GITHUB_REPOSITORY_NAME;

    if (owner && repo) {
      this.results.push({
        name: 'GitHub: Repository configured',
        passed: true,
        message: `✓ ${owner}/${repo}`,
        severity: 'info',
      });
    } else {
      this.results.push({
        name: 'GitHub: Repository configured',
        passed: true,
        message: '⚠ Repository owner/name not set (required for issue creation)',
        severity: 'warning',
      });
    }
  }

  displayResults() {
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Verification Results\n');

    const grouped = {
      error: [],
      warning: [],
      info: [],
    };

    for (const result of this.results) {
      grouped[result.severity].push(result);
    }

    if (grouped.error.length > 0) {
      console.log('❌ Errors:');
      for (const result of grouped.error) {
        console.log(`  ${result.message}`);
        console.log(`     (${result.name})\n`);
      }
    }

    if (grouped.warning.length > 0) {
      console.log('⚠️  Warnings:');
      for (const result of grouped.warning) {
        console.log(`  ${result.message}`);
        console.log(`     (${result.name})\n`);
      }
    }

    if (grouped.info.length > 0) {
      console.log('ℹ️  Info:');
      for (const result of grouped.info) {
        console.log(`  ${result.message}`);
        console.log(`     (${result.name})\n`);
      }
    }

    console.log('='.repeat(60));
    const passedCount = this.results.filter((r) => r.passed).length;
    const totalCount = this.results.length;
    const errorCount = grouped.error.length;

    console.log(`\n✅ Summary: ${passedCount}/${totalCount} checks passed\n`);

    if (errorCount > 0) {
      console.log(`❌ ${errorCount} error(s) found. Please fix before using.\n`);
      console.log('Fix steps:');
      console.log('1. Run: npm install');
      console.log('2. Create .env file from .env.example');
      console.log('3. Add GITHUB_TOKEN to .env');
      console.log('4. Run: npm run verify');
      process.exit(1);
    } else {
      console.log('✅ Setup is complete! Run tests with: npm test\n');
    }
  }
}

const verifier = new SetupVerifier();
verifier.verify().catch((error) => {
  console.error('Verification failed:', error);
  process.exit(1);
});
