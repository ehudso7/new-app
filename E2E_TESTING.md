# E2E Testing Guide for DealPulse

This guide explains how to run and maintain the end-to-end (E2E) tests for the DealPulse application.

## Overview

The E2E tests are built using [Playwright](https://playwright.dev/), a modern testing framework that supports cross-browser testing. The tests verify that the application works correctly from a user's perspective.

## Test Structure

The tests are organized in the `e2e/` directory:

```
e2e/
├── homepage.spec.ts       # Tests for the main homepage
├── navigation.spec.ts     # Tests for navigation between pages
├── deals.spec.ts          # Tests for deal functionality
├── search.spec.ts         # Tests for search functionality
├── subscription.spec.ts   # Tests for email subscription
├── responsive.spec.ts     # Tests for responsive design
├── performance.spec.ts    # Tests for performance and SEO
└── accessibility.spec.ts  # Tests for accessibility compliance
```

## Prerequisites

1. **Node.js** (v18 or later)
2. **npm** or **yarn**
3. All dependencies installed: `npm install`

## Installing Playwright Browsers

Before running tests for the first time, install the Playwright browsers:

```bash
npx playwright install
```

This will download Chromium, Firefox, and WebKit browsers.

## Running Tests

### Run all tests (headless mode)
```bash
npm test
```

### Run tests with UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests in a specific browser
```bash
npm run test:chrome    # Chromium only
npm run test:firefox   # Firefox only
npm run test:webkit    # WebKit/Safari only
```

### Run tests on mobile viewports
```bash
npm run test:mobile
```

### View test report
```bash
npm run test:report
```

## Test Configuration

The test configuration is in `playwright.config.ts`. Key settings:

- **baseURL**: Set to `http://localhost:3000` by default
- **Browsers**: Tests run on Chromium, Firefox, WebKit, and mobile viewports
- **Parallel execution**: Tests run in parallel for faster execution
- **Retries**: Configured for CI environments
- **Screenshots**: Taken on test failure
- **Traces**: Captured on first retry for debugging

## Environment Variables

You can customize test behavior with environment variables:

```bash
# Run tests against a different URL
BASE_URL=https://staging.dealpulse.com npm test

# Run in CI mode
CI=true npm test
```

## Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    
    // Your test code here
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### Best Practices

1. **Use descriptive test names**: Clearly describe what the test verifies
2. **Wait for content**: Use `page.waitForTimeout()` or better wait strategies
3. **Use proper selectors**: Prefer role-based selectors and data-testid attributes
4. **Keep tests independent**: Each test should work standalone
5. **Clean up**: Remove any test data or state after tests
6. **Mock external APIs**: Avoid relying on real external services

### Common Patterns

#### Waiting for navigation
```typescript
await page.click('a[href="/about"]');
await expect(page).toHaveURL(/.*about/);
```

#### Checking element visibility
```typescript
await expect(page.locator('header')).toBeVisible();
```

#### Filling forms
```typescript
await page.fill('input[type="email"]', 'test@example.com');
await page.click('button[type="submit"]');
```

#### Taking screenshots
```typescript
await page.screenshot({ path: 'screenshot.png' });
```

## Debugging Tests

### Using Playwright Inspector
```bash
npm run test:debug
```

This opens the Playwright Inspector where you can:
- Step through tests
- Inspect the DOM
- View console logs
- Record new tests

### Viewing Traces
If a test fails, you can view the trace:
```bash
npx playwright show-trace trace.zip
```

### Running a Single Test
```bash
npx playwright test homepage.spec.ts
```

### Running a Single Test by Name
```bash
npx playwright test -g "should load the homepage"
```

## CI/CD Integration

The tests are configured to run in CI environments. Key features:

- **Retries**: Tests retry twice on failure in CI
- **Serial execution**: Tests run one at a time in CI to avoid resource issues
- **Screenshots and traces**: Automatically captured on failure

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Test Coverage

Current test coverage includes:

- ✅ Homepage rendering and functionality
- ✅ Navigation between pages
- ✅ Deal browsing and filtering
- ✅ Search functionality
- ✅ Email subscription
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Performance and SEO
- ✅ Basic accessibility compliance

## Troubleshooting

### Tests timeout
- Increase timeout in `playwright.config.ts`
- Check if the dev server is running properly
- Ensure sufficient system resources

### Browser not found
- Run `npx playwright install` to download browsers
- Check system requirements

### Tests fail locally but pass in CI (or vice versa)
- Check for timing issues (add proper waits)
- Verify environment variables
- Check for hardcoded URLs or paths

### Port already in use
- Stop any running dev servers on port 3000
- Or configure a different port in `playwright.config.ts`

## Maintenance

### Updating Playwright
```bash
npm install -D @playwright/test@latest
npx playwright install
```

### Reviewing Failed Tests
1. Check the test report: `npm run test:report`
2. Review screenshots in `test-results/`
3. Check traces for detailed debugging
4. Update tests if application behavior changed intentionally

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)

## Support

For issues or questions about E2E tests:
1. Check this documentation
2. Review Playwright documentation
3. Check existing test examples in `e2e/`
4. Open an issue in the project repository
