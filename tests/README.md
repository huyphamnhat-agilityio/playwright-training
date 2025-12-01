# Playwright Test Suite

## Structure

```
tests/
├── config/          # Test data and configuration
│   └── test-data.ts
├── e2e/             # End-to-end test specs
│   └── auth.spec.ts
├── fixtures/        # Custom fixtures for test setup
│   └── auth.fixture.ts
└── pages/           # Page Object Models
    ├── LoginPage.ts
    └── DashboardPage.ts
```

## Test Cases

### Authentication Tests (TC_AUTH1_001 - TC_AUTH4_004)

- **TC_AUTH1_001**: User can login with valid credentials
- **TC_AUTH1_002**: User cannot submit form with invalid credentials (3 cases)
- **TC_AUTH1_003**: User cannot login with wrong credentials (2 cases)
- **TC_AUTH4_004**: User can logout

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in headed mode
pnpm test:headed

# Run tests with UI mode
pnpm test:ui

# Run custom test case ID filter
pnpm test:tc @TC_AUTH_001

# Show test report
pnpm report
```

## Configuration

The tests are configured to run against PocketBase Admin UI at `https://pocketbase.io/_/`.

Update the `.env` file with your test credentials:

```env
BASE_URL=https://pocketbase.io/_/
TEST_EMAIL=your-email@example.com
TEST_PASSWORD=your-password
```
