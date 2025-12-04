# Playwright Advanced Test Automation Training

A Playwright-based test automation framework for testing PocketBase Admin UI with TypeScript, Page Object Model, environment configuration, and global authentication.

## Plan

- Google Docs: [Playwright](https://docs.google.com/document/d/1nAn4gAfPQ63mT6e6NqyeUFgsMU4xIVSMZcO51EN4Tqw/edit?usp=sharing)

## Targets

- Codebase Structure:
  - Set up essential configurations for the testing environment with environment variables.

- Test Case Development:
  - Create test cases utilizing appropriate locators and user actions.

- Assertions:
  - Define clear and accurate expectations for each test scenario.

- Tools for Debug & Troubleshooting:
  - Use Playwright tools like Trace Viewer, Inspector, and logs for quick debugging.

## Features

- ✅ TypeScript support
- ✅ Page Object Model (POM) pattern
- ✅ User-facing locators (getByRole, getByPlaceholder, etc.)
- ✅ Global authentication setup (login once, reuse across tests)
- ✅ Custom fixtures for page objects
- ✅ Parallel test
- ✅ Environment variable configuration (.env)
- ✅ Test tagging
- ✅ ESLint configuration
- ✅ Prettier formatting
- ✅ Husky pre-commit hooks
- ✅ Commitlint for conventional commits
- ✅ Multiple browser support (Chromium, Firefox, WebKit)
- ✅ Dynamic browser configuration

## Installation

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install
```

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
BASE_URL=https://pocketbase.io/_/
TEST_EMAIL=test@example.com
TEST_PASSWORD=123456

## Project Structure

```

.
├── tests/
│ ├── config/
│ │ └── browsers.ts # Browser configs and test patterns
│ ├── constants/
│ │ ├── accessibility.ts # Accessibility constants
│ │ ├── auth-credentials.ts # Authentication credentials
│ │ ├── endpoints.ts # API endpoints
│ │ ├── index.ts # Constants barrel export
│ │ ├── messages.ts # Success/error messages
│ │ ├── urls.ts # URL constants
│ │ └── user-test-data.ts # User test data
│ ├── e2e/
│ │ ├── auth.setup.ts # Global authentication setup
│ │ ├── auth.spec.ts # Authentication tests
│ │ └── users.spec.ts # User management tests
│ ├── fixtures/
│ │ ├── auth.fixture.ts # Authentication fixtures
│ │ └── users.fixture.ts # User management fixtures
│ ├── pages/
│ │ ├── BasePage.ts # Base page object
│ │ ├── DashboardPage.ts # Dashboard page object
│ │ ├── LoginPage.ts # Login page object
│ │ └── UsersPage.ts # Users page object
│ ├── types/
│ │ ├── api.ts # API type definitions
│ │ ├── index.ts # Types barrel export
│ │ └── user.ts # User type definitions
│ └── utils/
│ └── validation.ts # Validation utilities
├── .env # Environment variables (gitignored)
├── .env.example # Environment variables template
├── .gitignore # Git ignore rules
├── commitlint.config.cjs # Commitlint configuration
├── eslint.config.js # ESLint configuration
├── package.json # Project dependencies and scripts
├── playwright.config.ts # Playwright configuration
├── pnpm-lock.yaml # PNPM lock file
├── tsconfig.json # TypeScript configuration
└── vercel.json # Vercel deployment config

````

## Authentication Setup

This project uses Playwright's global authentication approach:

1. **auth.setup.ts** - Runs once before all tests, logs in and saves the authenticated state
2. **Storage State** - Saved to `playwright/.auth/user.json` (gitignored)
3. **Test Projects** - Configured dynamically from `tests/config/browsers.ts`
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

# View test report
pnpm report
````

## Test Cases

- List test case: [List](https://docs.google.com/spreadsheets/d/1rj4-J2xOHFlOYSzy9KrItIK1F5rqTZeLPFD3-yq0Lqc/edit?usp=sharing)

## Locator Strategy

This framework follows Playwright's best practices for locators, prioritizing user-facing attributes:

1. **getByRole** - For interactive elements (buttons, links, headings)
2. **getByPlaceholder** - For input fields with placeholders
3. **getByLabel** - For form fields with labels
4. **Semantic CSS classes** - For non-interactive elements
5. **data-test attributes** - Only as a last resort

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
