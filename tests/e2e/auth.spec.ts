import { test, expect } from "../fixtures/page-fixtures";
import { LoginPage } from "../pages/LoginPage";
import { LOGIN_CREDENTIALS, LOGIN_FAILURE_CASES } from "../data/auth-test-data";

test.describe("Authentication Test Suite", () => {
  test("TC_AUTH_001: User can login with right username and password", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    // Pre-condition: User access the login page
    await loginPage.navigateTo();

    // Steps:
    // 1. User focuses the username field
    // 2. User fills the username field with value: "standard_user"
    await loginPage.usernameInput.click();
    await loginPage.usernameInput.fill(LOGIN_CREDENTIALS.VALID.username);

    // 3. User focuses the password field
    // 4. User fills the password field with value: "secret_sauce"
    await loginPage.passwordInput.click();
    await loginPage.passwordInput.fill(LOGIN_CREDENTIALS.VALID.password);

    // 5. User clicks the login button
    await loginPage.loginButton.click();

    // Expected Result: User logins success and navigates to product page
    await expect(page).toHaveURL(/.*inventory\.html/);
    const isOnProductPage = await loginPage.isOnProductPage();
    expect(isOnProductPage).toBeTruthy();
  });

  // Parameterized tests for login failures
  test.describe("TC_AUTH_002: Login Failure Scenarios", () => {
    for (const testCase of LOGIN_FAILURE_CASES) {
      test(`User cannot login with ${testCase.description}`, async ({
        page,
      }) => {
        const loginPage = new LoginPage(page);

        // Pre-condition: User access the login page
        await loginPage.navigateTo();

        // Steps: Fill credentials and attempt login
        await loginPage.usernameInput.fill(testCase.username);
        await loginPage.passwordInput.fill(testCase.password);
        await loginPage.loginButton.click();

        // Expected Result: User stays in login page and see the error message
        const isOnLoginPage = await loginPage.isOnLoginPage();
        expect(isOnLoginPage).toBeTruthy();
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText(
          testCase.expectedError,
        );
      });
    }
  });

  test("TC_AUTH_003: User can logout", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Pre-condition: User logged in
    await loginPage.navigateTo();
    await loginPage.login(
      LOGIN_CREDENTIALS.VALID.username,
      LOGIN_CREDENTIALS.VALID.password,
    );
    await expect(page).toHaveURL(/.*inventory\.html/);

    // Steps:
    // 1. User opens the sidebar by click on the sidebar icon
    await loginPage.menuButton.click();

    // 2. User clicks logout label
    await loginPage.logoutLink.click();

    // Expected Result: User navigates to login page
    const isOnLoginPage = await loginPage.isOnLoginPage();
    expect(isOnLoginPage).toBeTruthy();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
