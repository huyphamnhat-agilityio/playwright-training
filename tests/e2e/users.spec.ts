import { test, expect } from "@tests/fixtures/users.fixture";
import {
  USER_CREATION_TEST_DATA,
  USER_INVALID_FORM_TEST_DATA,
  USER_WRONG_VALUE_TEST_DATA,
} from "@tests/constants/user-test-data";
import { ApiErrorResponse, User } from "@tests/types";
import { API_ENDPOINTS, ERROR_MESSAGES } from "@tests/constants";

test.describe("User Management Tests", () => {
  // Parameterized test for user creation
  for (const testCase of USER_CREATION_TEST_DATA) {
    test.describe(`${testCase.caseId}`, () => {
      let createdUser: User;
      // Cleanup after the test
      test.afterEach(async ({ usersPage }) => {
        if (createdUser && createdUser.id) {
          await test.step("Delete created user after test", async () => {
            try {
              const deleteCheckbox = usersPage.getUserDeleteCheckbox(
                createdUser.id,
              );
              await deleteCheckbox.click();

              await usersPage.deleteButton.click();

              // Listen for DELETE API response and confirm deletion
              const [deleteResponse] = await Promise.all([
                usersPage.page.waitForResponse(
                  (response) =>
                    response.url().includes(API_ENDPOINTS.COLLECTIONS) &&
                    response.request().method() === "DELETE",
                  { timeout: 10000 },
                ),
                usersPage.confirmDeleteButton.click(),
              ]);

              // Verify DELETE API response
              expect(deleteResponse.status()).toBe(204); // 204 No Content is typical for successful DELETE

              // Verify user is deleted from UI (wait for UI to update)
              const userElement = await usersPage.getUserByEmail(
                createdUser.email,
              );
              await expect(userElement).not.toBeVisible({ timeout: 5000 });
            } catch (error) {
              console.warn(
                `Failed to delete user ${createdUser.email}:`,
                error,
              );
            }
          });
        }
      });

      test(`TC_USER_001 - User can create a user with valid value - ${testCase.caseId} @TC_USER_001`, async ({
        page,
        usersPage,
      }) => {
        test.info().annotations.push({
          type: "description",
          description: testCase.description,
        });

        await test.step('User clicks "New Record" button', async () => {
          await usersPage.newRecordButton.click();
        });

        await test.step("User focuses the email field and fills the value", async () => {
          await usersPage.emailField.focus();
          await usersPage.emailField.fill(testCase.email);
          await expect(usersPage.emailField).toHaveValue(testCase.email);
        });

        await test.step("User focuses the password field and fills the value", async () => {
          await usersPage.passwordField.focus();
          await usersPage.passwordField.fill(testCase.password);
          await expect(usersPage.passwordField).toHaveValue(testCase.password);
        });

        await test.step("User focuses the password confirm field and fills the value", async () => {
          await usersPage.passwordConfirmField.focus();
          await usersPage.passwordConfirmField.fill(testCase.passwordConfirm);
          await expect(usersPage.passwordConfirmField).toHaveValue(
            testCase.passwordConfirm,
          );
        });

        await test.step('User clicks the "Create" button and verifies API response', async () => {
          // Listen for API response before clicking
          const [response] = await Promise.all([
            page.waitForResponse(
              (response) =>
                response.url().includes(API_ENDPOINTS.COLLECTIONS) &&
                response.request().method() === "POST",
              { timeout: 30000 },
            ),
            usersPage.createButton.click(),
          ]);

          // Capture API response
          createdUser = await response.json();

          // Verify API response
          expect(response.status()).toBe(200);
          expect(createdUser.email).toBe(testCase.email);
          expect(createdUser.id).toBeDefined();
        });

        await test.step("User can see the new user on the list", async () => {
          // Verify user appears in the UI
          const userInList = await usersPage.getUserByEmail(testCase.email);
          await expect(userInList).toBeVisible();

          // Verify UI data matches API response
          await expect(userInList).toContainText(testCase.email);
        });

        await test.step("Verify UI result matches API response", async () => {
          // Verify UI shows the same data
          const userInList = await usersPage.getUserByEmail(createdUser.email);
          await expect(userInList).toContainText(createdUser.email);
        });
      });
    });
  }

  // Parameterized test for user form validation with invalid values
  for (const testCase of USER_INVALID_FORM_TEST_DATA) {
    test.describe(`${testCase.caseId}`, () => {
      test(`TC_USER_002 - User cannot submit create user form with invalid value - ${testCase.caseId} @TC_USER_002`, async ({
        usersPage,
      }) => {
        test.info().annotations.push({
          type: "description",
          description: testCase.description,
        });

        await test.step('User clicks "New Record" button', async () => {
          await usersPage.newRecordButton.click();
        });

        await test.step(`User focuses the email field and fills the value: "${testCase.email || "(empty)"}"`, async () => {
          await usersPage.emailField.focus();
          await usersPage.emailField.fill(testCase.email);
          await expect(usersPage.emailField).toHaveValue(testCase.email);
        });

        await test.step(`User focuses the password field and fills the value: "${testCase.password || "(empty)"}"`, async () => {
          await usersPage.passwordField.focus();
          await usersPage.passwordField.fill(testCase.password);
          await expect(usersPage.passwordField).toHaveValue(testCase.password);
        });

        await test.step(`User focuses the password confirm field and fills the value: "${testCase.passwordConfirm || "(empty)"}"`, async () => {
          await usersPage.passwordConfirmField.focus();
          await usersPage.passwordConfirmField.fill(testCase.passwordConfirm);
          await expect(usersPage.passwordConfirmField).toHaveValue(
            testCase.passwordConfirm,
          );
        });

        await test.step('User clicks the "Create" button', async () => {
          await usersPage.createButton.click();
        });

        await test.step("User cannot submit the form", async () => {
          // Verify we're still on the create user form
          await expect(usersPage.createButton).toBeVisible();
        });
      });
    });
  }

  // Parameterized test for user creation with wrong values
  for (const testCase of USER_WRONG_VALUE_TEST_DATA) {
    test.describe(`Wrong Values - ${testCase.caseId}`, () => {
      test(`TC_USER_003 - User cannot create user with wrong value - ${testCase.caseId} @TC_USER_003`, async ({
        page,
        usersPage,
      }) => {
        test.info().annotations.push({
          type: "description",
          description: testCase.description,
        });

        let apiErrorResponse: ApiErrorResponse;

        await test.step('User clicks "New Record" button', async () => {
          await usersPage.newRecordButton.click();
        });

        await test.step(`User focuses the email field and fills the value: "${testCase.email}"`, async () => {
          await usersPage.emailField.focus();
          await usersPage.emailField.fill(testCase.email);
          await expect(usersPage.emailField).toHaveValue(testCase.email);
        });

        await test.step(`User focuses the password field and fills the value: "${testCase.password}"`, async () => {
          await usersPage.passwordField.focus();
          await usersPage.passwordField.fill(testCase.password);
          await expect(usersPage.passwordField).toHaveValue(testCase.password);
        });

        await test.step(`User focuses the password confirm field and fills the value: "${testCase.passwordConfirm}"`, async () => {
          await usersPage.passwordConfirmField.focus();
          await usersPage.passwordConfirmField.fill(testCase.passwordConfirm);
          await expect(usersPage.passwordConfirmField).toHaveValue(
            testCase.passwordConfirm,
          );
        });

        await test.step('User clicks the "Create" button and receives error', async () => {
          // Listen for API error response
          const [response] = await Promise.all([
            page.waitForResponse(
              (response) =>
                response.url().includes(API_ENDPOINTS.COLLECTIONS) &&
                response.request().method() === "POST",
              { timeout: 30000 },
            ),
            usersPage.createButton.click(),
          ]);

          // Capture API error response
          apiErrorResponse = await response.json();

          // Verify API error response
          expect(response.status()).toBe(400); // Bad Request for validation errors
          expect(apiErrorResponse.message).toBeDefined();
        });

        await test.step("User can see error message and stays on create form", async () => {
          // Verify error message appears in UI
          const errorMessage = page.getByText(ERROR_MESSAGES.CREATE_FAIL);
          await expect(errorMessage).toBeVisible({ timeout: 5000 });

          // Verify we're still on the create form
          await expect(usersPage.createButton).toBeVisible();
        });

        await test.step("Verify UI error message matches API response", async () => {
          // Get the error message from UI
          const errorMessage = page.getByText(ERROR_MESSAGES.CREATE_FAIL);
          const uiErrorText = await errorMessage.textContent();

          // Verify UI error message contains the API error message
          expect(uiErrorText).toContain(apiErrorResponse.message);

          // Also verify it matches expected error pattern
          const inputErrorMessage = page.getByText(testCase.expectedError);
          expect(await inputErrorMessage.textContent()).toContain(
            testCase.expectedError,
          );
        });
      });
    });
  }
});
