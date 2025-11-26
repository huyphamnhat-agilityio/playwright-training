# Playwright Test Automation Training

A Playwright-based test automation framework for testing the Sauce Demo website with TypeScript, Page Object Model, and global authentication.

## Plan

- Google Docs: [Playwright](https://docs.google.com/document/d/1u4Di-veBqsdhIPm8IZRZkiGRUCuDEh5p0mOii-DHw0k/edit?usp=sharing)

## Targets

- Codebase Structure:
  - Set up essential configurations for the testing environment.

- Test Case Development:
  - Create test cases utilizing appropriate locators and user actions.

- Assertions:
  - Define clear and accurate expectations for each test scenario.

- Tools for Debug & Troubleshooting:
  - Use Playwright tools like Trace Viewer, Inspector, and logs for quick debugging.

## Features

- ✅ TypeScript support
- ✅ Page Object Model (POM) pattern
- ✅ Global authentication setup (login once, reuse across tests)
- ✅ Custom fixtures for page objects
- ✅ ESLint configuration
- ✅ Prettier formatting
- ✅ Husky pre-commit hooks
- ✅ Commitlint for conventional commits
- ✅ Multiple browser support (Chromium, Firefox, WebKit)

## Installation

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install
```

## Project Structure

```
.
├── tests/
│   ├── config/
│   │   └── constants.ts       # Browser configs and constants
│   ├── e2e/
│   │   ├── auth.setup.ts      # Global authentication setup
│   │   ├── auth.spec.ts       # Authentication tests
│   │   └── products.spec.ts   # Product tests
│   ├── pages/
│   │   ├── BasePage.ts        # Base page class
│   │   ├── LoginPage.ts       # Login page object
│   │   └── ProductPage.ts     # Product page object
│   ├── fixtures/
│   │   └── page-fixtures.ts   # Custom test fixtures
│   └── utils/
│       └── helpers.ts         # Helper functions
├── playwright.config.ts       # Playwright configuration
├── eslint.config.js          # ESLint configuration
└── package.json
```

## Authentication Setup

This framework uses Playwright's global authentication approach:

1. **auth.setup.ts** - Runs once before all tests, logs in and saves the authenticated state
2. **Storage State** - Saved to `playwright/.auth/user.json` (gitignored)
3. **Test Projects** - Configured dynamically from `tests/config/constants.ts`
   - Unauthenticated projects: For auth tests (e.g., `chromium-unauthenticated`)
   - Authenticated projects: For all other tests (e.g., `chromium`, `firefox`, `webkit`)

This means:

- Login happens only once per test run
- All tests start with an authenticated session
- Faster test execution
- No need for `beforeEach` login blocks

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in headed mode
pnpm test:headed

# Run tests in UI mode
pnpm test:ui

# Run tests in debug mode
pnpm test:debug

# Run tests for specific browser
pnpm test:chromium
pnpm test:firefox
pnpm test:webkit

# View test report
pnpm report
```

## Test Cases

### Authentication (TC_AUTH)

- TC_AUTH_001: User can login with correct credentials
- TC_AUTH_002: User cannot login with wrong credentials
- TC_AUTH_003: User can logout

### Products (TC_PRODUCTS)

- TC_PRODUCTS_001: User can see the product list
- TC_PRODUCTS_002: User can filter products by price
- TC_PRODUCTS_003: User can add products to cart
- TC_PRODUCTS_004: User can remove products from cart
- TC_PRODUCTS_005: User can navigate to product detail page
- TC_PRODUCTS_006: User can reset app state

## Commit Convention

This project uses conventional commits:

```
feat: add new feature
fix: fix a bug
docs: documentation changes
chore: maintenance tasks
style: code style changes
refactor: code refactoring
test: add or update tests
```

## Author

huy.phamnhat@asnet.com.vn
