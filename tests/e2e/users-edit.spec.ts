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

  // TC_USERS_004: User can edit user
  test.describe(`User can edit user`, () => {
    let testUser: User;

    // Setup: Create a user before the test
    test.beforeEach(async ({ usersPage, browserName }) => {
      await test.step("Setup: Create test user", async () => {
        const payload: UserCreatePayload = {
          email: `${USER_EDIT_TEST_DATA.originalEmail}${browserName}`,
          password: USER_EDIT_TEST_DATA.originalPassword,
          passwordConfirm: USER_EDIT_TEST_DATA.originalPassword,
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

    test(
      `TC_USERS_004 - User can edit user with valid value`,
      {
        tag: ["@TC_USERS_004", "@user", "@edit"],
      },
      async ({ page, usersPage }) => {
        let apiResponse: User;

        await test.step(`User clicks the table data with title: "${USER_EDIT_TEST_DATA.originalEmail}"`, async () => {
          await usersPage.editUserByEmail(USER_EDIT_TEST_DATA.originalEmail);
        });

        await test.step("Verify edit form is show to the screen", async () => {
          const formHeading = page.getByRole("heading", {
            name: "Edit users record",
          });
          await expect(formHeading).toBeVisible();
        });

        await test.step(`User focuses the email field and fills the value: "${USER_EDIT_TEST_DATA.newEmail}"`, async () => {
          await usersPage.emailField.click();
          await usersPage.emailField.fill(USER_EDIT_TEST_DATA.newEmail);
          await expect(usersPage.emailField).toHaveValue(
            USER_EDIT_TEST_DATA.newEmail,
          );
        });

        await test.step("User clicks the change password checkbox", async () => {
          await usersPage.clickChangePasswordCheckbox();
        });

        await test.step(`User focuses the password field and fills the value: "${USER_EDIT_TEST_DATA.newPassword}"`, async () => {
          await usersPage.passwordField.click();
          await usersPage.passwordField.fill(USER_EDIT_TEST_DATA.newPassword);
          await expect(usersPage.passwordField).toHaveValue(
            USER_EDIT_TEST_DATA.newPassword,
          );
        });

        await test.step(`User focuses the password confirm field and fills the value: "${USER_EDIT_TEST_DATA.newPasswordConfirm}"`, async () => {
          await usersPage.passwordConfirmField.click();
          await usersPage.passwordConfirmField.fill(
            USER_EDIT_TEST_DATA.newPasswordConfirm,
          );
          await expect(usersPage.passwordConfirmField).toHaveValue(
            USER_EDIT_TEST_DATA.newPasswordConfirm,
          );
        });

        await test.step('User clicks the "Save changes" button and verifies API response', async () => {
          const response = await usersPage.waitForApiResponse(
            "PATCH",
            async () => await usersPage.saveChangesButton.click(),
          );

          apiResponse = await response.json();

          expect(response.status()).toBe(200);
          expect(apiResponse.email).toBe(USER_EDIT_TEST_DATA.newEmail);
          expect(apiResponse.id).toBe(testUser.id);
        });

        await test.step("User can see the new updated user information on the list beside the success toast message", async () => {
          await usersPage.verifySuccessMessage(SUCCESS_MESSAGES.UPDATE_SUCCESS);

          const userInList = await usersPage.getUserByEmail(
            USER_EDIT_TEST_DATA.newEmail,
          );
          await expect(userInList).toBeVisible();
          await expect(userInList).toContainText(USER_EDIT_TEST_DATA.newEmail);
        });

        await test.step("Verify UI result matches API response", async () => {
          expect(apiResponse.email).toBe(USER_EDIT_TEST_DATA.newEmail);
          expect(apiResponse.id).toBe(testUser.id);

          const userInList = await usersPage.getUserByEmail(
            USER_EDIT_TEST_DATA.newEmail,
          );
          await expect(userInList).toContainText(apiResponse.email);

          testUser = apiResponse;
        });
      },
    );
  });

  // TC_USERS_005: User cannot submit edit user form with invalid value
  for (const testCase of USER_EDIT_INVALID_TEST_DATA) {
    test.describe(`User cannot submit edit user form with invalid value`, () => {
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

      test(
        `TC_USERS_005 - User cannot submit edit user form with ${testCase.description}`,
        {
          tag: ["@TC_USERS_005", "@user", "@edit"],
        },
        async ({ usersPage }) => {
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
        },
      );
    });
  }

  // TC_USERS_006: User cannot submit edit user form with wrong value
  for (const testCase of USER_EDIT_WRONG_VALUE_TEST_DATA) {
    test.describe(`User cannot submit edit user form with wrong value`, () => {
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

      test(
        `TC_USERS_006 - User cannot submit edit user form with ${testCase.description}`,
        {
          tag: ["@TC_USERS_006", "@user", "@edit"],
        },
        async ({ page, usersPage, browserName }) => {
          test.info().annotations.push({
            type: "description",
            description: testCase.description,
          });

          let apiErrorResponse: ApiErrorResponse;

          await test.step(`User clicks the table data with title: "${testCase.originalEmail}"`, async () => {
            await usersPage.editUserByEmail(testCase.originalEmail);
          });

          await test.step(`User focuses the email field and fills the value: "${testCase.newEmail}"`, async () => {
            await usersPage.emailField.fill(
              `${testCase.newEmail}${browserName}`,
            );
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

          await test.step("User can see error toast message, input error message and stays on edit form", async () => {
            // Error toast message is visible
            const errorMessage = page.getByText(ERROR_MESSAGES.UPDATE_FAIL);
            await expect(errorMessage).toBeVisible({ timeout: 5000 });

            // User still on edit form
            await expect(usersPage.saveChangesButton).toBeVisible();

            // Form input error message
            const inputErrorMessage = page.getByText(testCase.expectedError);
            expect(await inputErrorMessage.textContent()).toContain(
              testCase.expectedError,
            );
          });
        },
      );
    });
  }
});
