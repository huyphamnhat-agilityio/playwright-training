import { test, expect } from "@tests/fixtures/users.fixture";
import {
  USER_EDIT_TEST_DATA,
  USER_EDIT_INVALID_TEST_DATA,
  USER_EDIT_WRONG_VALUE_TEST_DATA,
} from "@tests/constants/user-test-data";
import { ApiErrorResponse, User, UserCreatePayload } from "@tests/types";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@tests/constants";
import { createUser, deleteUser } from "@tests/services";

test.describe("User Edit Tests", () => {
  test.slow();

  // TC_USER_004: User can edit user
  for (const testCase of USER_EDIT_TEST_DATA) {
    test.describe(`${testCase.caseId}`, () => {
      let testUser: User;

      // Setup: Create a user before the test
      test.beforeEach(async ({ usersPage, browserName }) => {
        await test.step("Setup: Create test user", async () => {
          const payload: UserCreatePayload = {
            email: `${testCase.originalEmail}${browserName}`,
            password: testCase.originalPassword,
            passwordConfirm: testCase.originalPassword,
          };

          // Create User via request Playwright API
          testUser = await createUser(payload);

          // Verify UI that user has been created
          await usersPage.navigateTo();

          await expect(
            await usersPage.getUserByEmail(testUser.email),
          ).toBeVisible();
        });
      });

      // Cleanup: Delete the user after the test
      test.afterEach(async () => {
        if (testUser && testUser.id) {
          await test.step("Cleanup: Delete test user data", async () => {
            await deleteUser(testUser.id);
          });
        }
      });

      test(`TC_USER_004 - User can edit user - @TC_USER_004`, async ({
        page,
        usersPage,
      }) => {
        test.info().annotations.push({
          type: "description",
          description: testCase.description,
        });

        let apiResponse: User;

        await test.step(`User clicks the table data with title: "${testCase.originalEmail}"`, async () => {
          await usersPage.editUserByEmail(testCase.originalEmail);
        });

        await test.step("Verify edit form is show to the screen", async () => {
          const formHeading = page.getByRole("heading", {
            name: "Edit users record",
          });
          await expect(formHeading).toBeVisible();
        });

        await test.step(`User focuses the email field and fills the value: "${testCase.newEmail}"`, async () => {
          await usersPage.emailField.click();
          await usersPage.emailField.fill(testCase.newEmail);
          await expect(usersPage.emailField).toHaveValue(testCase.newEmail);
        });

        await test.step("User clicks the change password checkbox", async () => {
          await usersPage.clickChangePasswordCheckbox();
        });

        await test.step(`User focuses the password field and fills the value: "${testCase.newPassword}"`, async () => {
          await usersPage.passwordField.click();
          await usersPage.passwordField.fill(testCase.newPassword);
          await expect(usersPage.passwordField).toHaveValue(
            testCase.newPassword,
          );
        });

        await test.step(`User focuses the password confirm field and fills the value: "${testCase.newPasswordConfirm}"`, async () => {
          await usersPage.passwordConfirmField.click();
          await usersPage.passwordConfirmField.fill(
            testCase.newPasswordConfirm,
          );
          await expect(usersPage.passwordConfirmField).toHaveValue(
            testCase.newPasswordConfirm,
          );
        });

        await test.step('User clicks the "Save changes" button and verifies API response', async () => {
          const response = await usersPage.waitForApiResponse(
            "PATCH",
            async () => await usersPage.saveChangesButton.click(),
          );

          apiResponse = await response.json();

          expect(response.status()).toBe(200);
          expect(apiResponse.email).toBe(testCase.newEmail);
          expect(apiResponse.id).toBe(testUser.id);
        });

        await test.step("User can see the new updated user information on the list", async () => {
          await usersPage.verifySuccessMessage(SUCCESS_MESSAGES.UPDATE_SUCCESS);

          const userInList = await usersPage.getUserByEmail(testCase.newEmail);
          await expect(userInList).toBeVisible();
          await expect(userInList).toContainText(testCase.newEmail);
        });

        await test.step("Verify UI result matches API response", async () => {
          expect(apiResponse.email).toBe(testCase.newEmail);
          expect(apiResponse.id).toBe(testUser.id);

          const userInList = await usersPage.getUserByEmail(testCase.newEmail);
          await expect(userInList).toContainText(apiResponse.email);

          testUser = apiResponse;
        });
      });
    });
  }

  // TC_USER_005: User cannot submit edit user form with invalid value
  for (const testCase of USER_EDIT_INVALID_TEST_DATA) {
    test.describe(`Edit Form Validation - ${testCase.caseId}`, () => {
      let testUser: User;

      // Setup: Create a user before the test
      test.beforeEach(async ({ usersPage, browserName }) => {
        await test.step("Setup: Create test user via UI", async () => {
          const payload: UserCreatePayload = {
            email: `${testCase.originalEmail}${browserName}`,
            password: testCase.originalPassword,
            passwordConfirm: testCase.originalPassword,
          };

          // Create User via request Playwright API
          testUser = await createUser(payload);

          // Verify UI that user has been created
          await usersPage.navigateTo();

          await expect(
            await usersPage.getUserByEmail(testUser.email),
          ).toBeVisible();
        });
      });

      // Cleanup: Delete the user after the test
      test.afterEach(async () => {
        if (testUser && testUser.id) {
          await test.step("Cleanup: Delete test user data", async () => {
            await deleteUser(testUser.id);
          });
        }
      });

      test(`TC_USER_005 - User cannot submit edit user form with invalid value - ${testCase.caseId} @TC_USER_005`, async ({
        usersPage,
      }) => {
        test.info().annotations.push({
          type: "description",
          description: testCase.description,
        });

        await test.step(`User clicks the table data with title: "${testCase.originalEmail}"`, async () => {
          await usersPage.editUserByEmail(testCase.originalEmail);
        });

        await test.step(`User focuses the email field and fills the value: "${testCase.newEmail || "(empty)"}"`, async () => {
          await usersPage.emailField.click();
          await usersPage.emailField.fill(testCase.newEmail);
          await expect(usersPage.emailField).toHaveValue(testCase.newEmail);
        });

        await test.step("User clicks the change password checkbox", async () => {
          await usersPage.clickChangePasswordCheckbox();
        });

        await test.step(`User focuses the password field and fills the value: "${testCase.newPassword || "(empty)"}"`, async () => {
          await usersPage.passwordField.click();
          await usersPage.passwordField.fill(testCase.newPassword);
          await expect(usersPage.passwordField).toHaveValue(
            testCase.newPassword,
          );
        });

        await test.step(`User focuses the password confirm field and fills the value: "${testCase.newPasswordConfirm || "(empty)"}"`, async () => {
          await usersPage.passwordConfirmField.click();
          await usersPage.passwordConfirmField.fill(
            testCase.newPasswordConfirm,
          );
          await expect(usersPage.passwordConfirmField).toHaveValue(
            testCase.newPasswordConfirm,
          );
        });

        await test.step('User clicks the "Save changes" button', async () => {
          await usersPage.saveChangesButton.click();
        });

        await test.step("User cannot submit the form", async () => {
          await expect(usersPage.saveChangesButton).toBeVisible();
          await usersPage.cancelButton.click();
        });
      });
    });
  }

  // TC_USER_006: User cannot submit edit user form with wrong value
  for (const testCase of USER_EDIT_WRONG_VALUE_TEST_DATA) {
    test.describe(`Edit Wrong Values - ${testCase.caseId}`, () => {
      let testUser: User;

      // Setup: Create a user before the test
      test.beforeEach(async ({ usersPage, browserName }) => {
        await test.step("Setup: Create test user", async () => {
          const payload: UserCreatePayload = {
            email: `${testCase.originalEmail}${browserName}`,
            password: testCase.originalPassword,
            passwordConfirm: testCase.originalPassword,
          };

          // Create User via request Playwright API
          testUser = await createUser(payload);

          // Verify UI that user has been created
          await usersPage.navigateTo();

          await expect(
            await usersPage.getUserByEmail(testUser.email),
          ).toBeVisible();
        });
      });

      // Cleanup: Delete the user after the test
      test.afterEach(async () => {
        if (testUser && testUser.id) {
          await test.step("Cleanup: Delete test user data", async () => {
            await deleteUser(testUser.id);
          });
        }
      });

      test(`TC_USER_006 - User cannot submit edit user form with wrong value - ${testCase.caseId} @TC_USER_006`, async ({
        page,
        usersPage,
        browserName,
      }) => {
        test.info().annotations.push({
          type: "description",
          description: testCase.description,
        });

        let apiErrorResponse: ApiErrorResponse;

        await test.step(`User clicks the table data with title: "${testCase.originalEmail}"`, async () => {
          await usersPage.editUserByEmail(testCase.originalEmail);
        });

        await test.step(`User focuses the email field and fills the value: "${testCase.newEmail}"`, async () => {
          await usersPage.emailField.fill(`${testCase.newEmail}${browserName}`);
          await expect(usersPage.emailField).toHaveValue(
            `${testCase.newEmail}${browserName}`,
          );
        });

        await test.step("User clicks the change password checkbox", async () => {
          await usersPage.clickChangePasswordCheckbox();
        });

        await test.step(`User focuses the password field and fills the value: "${testCase.newPassword}"`, async () => {
          await usersPage.passwordField.fill(testCase.newPassword);
          await expect(usersPage.passwordField).toHaveValue(
            testCase.newPassword,
          );
        });

        await test.step(`User focuses the password confirm field and fills the value: "${testCase.newPasswordConfirm}"`, async () => {
          await usersPage.passwordConfirmField.fill(
            testCase.newPasswordConfirm,
          );
          await expect(usersPage.passwordConfirmField).toHaveValue(
            testCase.newPasswordConfirm,
          );
        });

        await test.step('User clicks the "Save changes" button and receives error', async () => {
          const response = await usersPage.waitForApiResponse(
            "PATCH",
            async () => await usersPage.saveChangesButton.click(),
          );

          apiErrorResponse = await response.json();

          expect(response.status()).toBe(400);
          expect(apiErrorResponse.message).toBeDefined();
        });

        await test.step("User can see error message and stays on edit form", async () => {
          const errorMessage = page.getByText(ERROR_MESSAGES.UPDATE_FAIL);
          await expect(errorMessage).toBeVisible({ timeout: 5000 });
          await expect(usersPage.saveChangesButton).toBeVisible();
        });

        await test.step("Verify UI error message matches API response", async () => {
          const errorMessage = page.getByText(ERROR_MESSAGES.UPDATE_FAIL);
          const uiErrorText = await errorMessage.textContent();

          expect(uiErrorText).toContain(apiErrorResponse.message);

          const inputErrorMessage = page.getByText(testCase.expectedError);
          expect(await inputErrorMessage.textContent()).toContain(
            testCase.expectedError,
          );
        });
      });
    });
  }
});
