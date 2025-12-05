import { test, expect } from "@tests/fixtures/auth.fixture";
import {
  ERROR_MESSAGES,
  INVALID_CREDENTIALS,
  UI_ELEMENTS,
  URL_PATTERNS,
  VALID_CREDENTIALS,
  WRONG_CREDENTIALS,
} from "@tests/constants";

test.describe.configure({ mode: "parallel" });

test.describe("Authentication Tests", () => {
  test.slow();

  test("TC_AUTH_001 - User can login with right username and password @TC_AUTH_001 @auth @login", async ({
    page,
    loginPage,
  }) => {
    await test.step("User fills the email field with valid email", async () => {
      await loginPage.emailField.fill(VALID_CREDENTIALS.email);
      await expect(loginPage.emailField).toHaveValue(VALID_CREDENTIALS.email);
    });

    await test.step("User fills the password field with valid password", async () => {
      await loginPage.passwordField.fill(VALID_CREDENTIALS.password);
      await expect(loginPage.passwordField).toHaveValue(
        VALID_CREDENTIALS.password,
      );
    });

    await test.step("User clicks the login button", async () => {
      await loginPage.loginButton.click();
    });

    await test.step("User successfully navigates to dashboard page", async () => {
      const dashboardLogo = page.getByRole("link", {
        name: UI_ELEMENTS.POCKETBASE_LOGO,
      });
      await expect(dashboardLogo).toBeVisible();
    });
  });

  // Parameterized test for invalid credentials (form validation)
  for (const testCase of INVALID_CREDENTIALS) {
    test(`TC_AUTH_002 - User cannot submit login form with invalid credentials - ${testCase.caseId} @TC_AUTH_002 @auth @login`, async ({
      loginPage,
    }) => {
      test.info().annotations.push({
        type: "description",
        description: testCase.description,
      });

      await test.step(`User fills the email field with: "${testCase.email || "(empty)"}"`, async () => {
        await loginPage.emailField.fill(testCase.email);
      });

      await test.step(`User fills the password field with: "${testCase.password || "(empty)"}"`, async () => {
        await loginPage.passwordField.fill(testCase.password);
      });

      await test.step("User clicks the login button", async () => {
        await loginPage.loginButton.click();
      });

      await test.step("User cannot submit the form and stays on login page", async () => {
        await expect(loginPage.page).toHaveURL(URL_PATTERNS.LOGIN);
      });
    });
  }

  // Parameterized test for wrong credentials (authentication failure)
  for (const testCase of WRONG_CREDENTIALS) {
    test(`TC_AUTH_003 - User cannot login with wrong credentials - ${testCase.caseId} @TC_AUTH_003 @auth @login`, async ({
      loginPage,
    }) => {
      test.slow();
      test.info().annotations.push({
        type: "description",
        description: testCase.description,
      });

      await test.step(`User fills the email field with wrong email: "${testCase.email}"`, async () => {
        await loginPage.emailField.fill(testCase.email);
      });

      await test.step(`User fills the password field with wrong password: "${testCase.password}"`, async () => {
        await loginPage.passwordField.fill(testCase.password);
      });

      await test.step("User clicks the login button", async () => {
        await loginPage.loginButton.click();
      });

      await test.step("User stays on login page and sees error message", async () => {
        await expect(loginPage.page).toHaveURL(URL_PATTERNS.LOGIN);
        await expect(
          loginPage.page.getByText(ERROR_MESSAGES.INVALID_CREDENTIALS),
        ).toBeVisible();
      });
    });
  }

  test("TC_AUTH_004 - User can logout @TC_AUTH_004 @auth @logout", async ({
    page,
    loginPage,
    dashboardPage,
  }) => {
    await test.step("User logs in with valid credentials", async () => {
      await loginPage.login(
        VALID_CREDENTIALS.email,
        VALID_CREDENTIALS.password,
      );
    });

    await test.step("User clicks the user menu button", async () => {
      await dashboardPage.userMenuButton.click();
    });

    await test.step("User clicks the logout button", async () => {
      await dashboardPage.logoutButton.click();
    });

    await test.step("User successfully navigates to login page", async () => {
      await expect(page).toHaveURL(URL_PATTERNS.LOGIN);
    });
  });
});
