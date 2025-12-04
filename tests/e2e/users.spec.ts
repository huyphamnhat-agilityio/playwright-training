import { isAscending, isDescending } from "./../utils/validation";
import { test, expect } from "@tests/fixtures/users.fixture";
import {
  USER_CREATION_TEST_DATA,
  USER_INVALID_FORM_TEST_DATA,
  USER_WRONG_VALUE_TEST_DATA,
  USER_EDIT_TEST_DATA,
  USER_EDIT_INVALID_TEST_DATA,
  USER_DELETE_TEST_DATA,
  USER_EDIT_WRONG_VALUE_TEST_DATA,
  USER_SORT_TEST_DATA,
} from "@tests/constants/user-test-data";
import { ApiErrorResponse, User } from "@tests/types";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@tests/constants";

// test.describe.serial("User Tests", () => {

// })

test.describe("User Management Tests", () => {
  test.slow();
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
              const deleteResponse = await usersPage.waitForApiResponse(
                "DELETE",
                async () => await usersPage.confirmDeleteButton.click(),
              );

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

      test(`TC_USER_001 - User can create a user with valid value - ${testCase.caseId} @TC_USER_001 @user @create`, async ({
        usersPage,
      }) => {
        test.slow();

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
          const response = await usersPage.waitForApiResponse(
            "POST",
            async () => await usersPage.createButton.click(),
          );

          // Capture API response
          createdUser = await response.json();

          // Verify API response
          expect(response.status()).toBe(200);
          expect(createdUser.email).toBe(testCase.email);
          expect(createdUser.id).toBeDefined();
        });

        await test.step("User can see the new user on the list", async () => {
          // Verify success message appears
          await usersPage.verifySuccessMessage(SUCCESS_MESSAGES.CREATE_SUCCESS);

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
      test(`TC_USER_002 - User cannot submit create user form with invalid value - ${testCase.caseId} @TC_USER_002 @user @create`, async ({
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

          await usersPage.cancelButton.click();
        });
      });
    });
  }

  // Parameterized test for user creation with wrong values
  for (const testCase of USER_WRONG_VALUE_TEST_DATA) {
    test.describe(`${testCase.caseId}`, () => {
      test(`TC_USER_003 - User cannot create user with wrong value - ${testCase.caseId} @TC_USER_003 @user @create`, async ({
        page,
        usersPage,
      }) => {
        test.slow();
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
          const response = await usersPage.waitForApiResponse(
            "POST",
            async () => await usersPage.createButton.click(),
          );

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

  // Parameterized test for user editing
  for (const testCase of USER_EDIT_TEST_DATA) {
    test.describe(`${testCase.caseId}`, () => {
      let testUser: User;

      // Setup: Create a user before the test
      test.beforeEach(async ({ usersPage, browserName }) => {
        await test.step("Setup: Create test user via UI", async () => {
          const email = `${testCase.originalEmail}${browserName}`;
          testUser = await usersPage.createUserViaUI(
            email,
            testCase.originalPassword,
          );
          expect(testUser.id).toBeDefined();
          expect(testUser.email).toBe(email);
        });
      });

      // Cleanup: Delete the user after the test
      test.afterEach(async ({ usersPage }) => {
        if (testUser && testUser.id) {
          await test.step("Cleanup: Delete test user via UI", async () => {
            try {
              // Click the checkbox for the user
              const deleteCheckbox = usersPage.getUserDeleteCheckbox(
                testUser.id,
              );
              await deleteCheckbox.waitFor({ state: "visible", timeout: 5000 });
              await deleteCheckbox.click();

              // Click delete button
              await usersPage.deleteButton.click();

              // Listen for DELETE API response and confirm deletion
              const deleteResponse = await usersPage.waitForApiResponse(
                "DELETE",
                async () => await usersPage.confirmDeleteButton.click(),
              );

              // Verify DELETE API response
              expect(deleteResponse.status()).toBe(204);

              // Verify user is deleted from UI (wait for UI to update)
              const userElement = await usersPage.getUserByEmail(
                testUser.email,
              );
              await expect(userElement).not.toBeVisible({ timeout: 5000 });
            } catch (error) {
              console.warn(
                `Failed to delete test user ${testUser.email}:`,
                error,
              );
            }
          });
        }
      });

      test(`TC_USER_004 - User can edit user - @TC_USER_004 @user @edit`, async ({
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
          // Listen for API response before clicking
          const response = await usersPage.waitForApiResponse(
            "PATCH",
            async () => await usersPage.saveChangesButton.click(),
          );

          // Capture API response
          apiResponse = await response.json();

          // Verify API response
          expect(response.status()).toBe(200);
          expect(apiResponse.email).toBe(testCase.newEmail);
          expect(apiResponse.id).toBe(testUser.id);
        });

        await test.step("User can see the new updated user information on the list", async () => {
          // Verify success message appears
          await usersPage.verifySuccessMessage(SUCCESS_MESSAGES.UPDATE_SUCCESS);

          // Verify updated user appears in the UI
          const userInList = await usersPage.getUserByEmail(testCase.newEmail);
          await expect(userInList).toBeVisible();

          // Verify UI data matches API response
          await expect(userInList).toContainText(testCase.newEmail);
        });

        await test.step("Verify UI result matches API response", async () => {
          // Verify API data matches what we updated
          expect(apiResponse.email).toBe(testCase.newEmail);
          expect(apiResponse.id).toBe(testUser.id);

          // Verify UI shows the same data
          const userInList = await usersPage.getUserByEmail(testCase.newEmail);
          await expect(userInList).toContainText(apiResponse.email);

          // Update testUser for cleanup
          testUser = apiResponse;
        });
      });
    });
  }

  // Parameterized test for user edit form validation with invalid values
  for (const testCase of USER_EDIT_INVALID_TEST_DATA) {
    test.describe(`Edit Form Validation - ${testCase.caseId}`, () => {
      let testUser: User;

      // Setup: Create a user before the test
      test.beforeEach(async ({ usersPage }) => {
        await test.step("Setup: Create test user via UI", async () => {
          testUser = await usersPage.createUserViaUI(
            testCase.originalEmail,
            testCase.originalPassword,
          );
          expect(testUser.id).toBeDefined();
          expect(testUser.email).toBe(testCase.originalEmail);
        });
      });

      // Cleanup: Delete the user after the test
      test.afterEach(async ({ usersPage }) => {
        if (testUser && testUser.id) {
          await test.step("Cleanup: Delete test user via UI", async () => {
            try {
              // Navigate to users page to ensure we're on the right page
              await usersPage.navigateTo();

              // Click the checkbox for the user
              const deleteCheckbox = usersPage.getUserDeleteCheckbox(
                testUser.id,
              );
              await deleteCheckbox.waitFor({ state: "visible", timeout: 5000 });
              await deleteCheckbox.click();

              // Click delete button
              await usersPage.deleteButton.click();

              // Listen for DELETE API response and confirm deletion
              await usersPage.waitForApiResponse(
                "DELETE",
                async () => await usersPage.confirmDeleteButton.click(),
              );

              // Verify user is deleted from UI (wait for UI to update)
              const userElement = await usersPage.getUserByEmail(
                testUser.email,
              );
              await expect(userElement).not.toBeVisible({ timeout: 5000 });
            } catch (error) {
              console.warn(
                `Failed to delete test user ${testUser.email}:`,
                error,
              );
            }
          });
        }
      });

      test(`TC_USER_005 - User cannot submit edit user form with invalid value - ${testCase.caseId} @TC_USER_005 @user @edit`, async ({
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
          // Verify we're still on the edit form (not navigated back to list)
          await expect(usersPage.saveChangesButton).toBeVisible();
          await usersPage.cancelButton.click();
        });
      });
    });
  }

  // Parameterized test for user edit with wrong values
  for (const testCase of USER_EDIT_WRONG_VALUE_TEST_DATA) {
    test.describe(`Edit Wrong Values - ${testCase.caseId}`, () => {
      let testUser: User;

      // Setup: Create a user before the test
      test.beforeEach(async ({ usersPage, browserName }) => {
        await test.step("Setup: Create test user via UI", async () => {
          const email = `${testCase.originalEmail}${browserName}`;
          testUser = await usersPage.createUserViaUI(
            email,
            testCase.originalPassword,
          );
          expect(testUser.id).toBeDefined();
          expect(testUser.email).toBe(email);
        });
      });

      // Cleanup: Delete the user after the test
      test.afterEach(async ({ usersPage }) => {
        if (testUser && testUser.id) {
          await test.step("Cleanup: Delete test user via UI", async () => {
            try {
              // Navigate to users page to ensure we're on the right page
              await usersPage.navigateTo();

              // Click the checkbox for the user
              const deleteCheckbox = usersPage.getUserDeleteCheckbox(
                testUser.id,
              );
              await deleteCheckbox.waitFor({ state: "visible", timeout: 5000 });
              await deleteCheckbox.click();

              // Click delete button
              await usersPage.deleteButton.click();

              // Listen for DELETE API response and confirm deletion
              await usersPage.waitForApiResponse(
                "DELETE",
                async () => await usersPage.confirmDeleteButton.click(),
              );

              // Verify user is deleted from UI (wait for UI to update)
              const userElement = await usersPage.getUserByEmail(
                testUser.email,
              );
              await expect(userElement).not.toBeVisible({ timeout: 5000 });
            } catch (error) {
              console.warn(
                `Failed to delete test user ${testUser.email}:`,
                error,
              );
            }
          });
        }
      });

      test(`TC_USER_006 - User cannot submit edit user form with wrong value - ${testCase.caseId} @TC_USER_006 @user @edit`, async ({
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
          await usersPage.emailField.focus();
          await usersPage.emailField.fill(`${testCase.newEmail}${browserName}`);
          await expect(usersPage.emailField).toHaveValue(
            `${testCase.newEmail}${browserName}`,
          );
        });

        await test.step("User clicks the change password checkbox", async () => {
          await usersPage.clickChangePasswordCheckbox();
        });

        await test.step(`User focuses the password field and fills the value: "${testCase.newPassword}"`, async () => {
          await usersPage.passwordField.focus();
          await usersPage.passwordField.fill(testCase.newPassword);
          await expect(usersPage.passwordField).toHaveValue(
            testCase.newPassword,
          );
        });

        await test.step(`User focuses the password confirm field and fills the value: "${testCase.newPasswordConfirm}"`, async () => {
          await usersPage.passwordConfirmField.focus();
          await usersPage.passwordConfirmField.fill(
            testCase.newPasswordConfirm,
          );
          await expect(usersPage.passwordConfirmField).toHaveValue(
            testCase.newPasswordConfirm,
          );
        });

        await test.step('User clicks the "Save changes" button and receives error', async () => {
          // Listen for API error response
          const response = await usersPage.waitForApiResponse(
            "PATCH",
            async () => await usersPage.saveChangesButton.click(),
          );

          // Capture API error response
          apiErrorResponse = await response.json();

          // Verify API error response
          expect(response.status()).toBe(400); // Bad Request for validation errors
          expect(apiErrorResponse.message).toBeDefined();
        });

        await test.step("User can see error message and stays on edit form", async () => {
          // Verify error message appears in UI
          const errorMessage = page.getByText(ERROR_MESSAGES.UPDATE_FAIL);
          await expect(errorMessage).toBeVisible({ timeout: 5000 });

          // Verify we're still on the edit form
          await expect(usersPage.saveChangesButton).toBeVisible();
        });

        await test.step("Verify UI error message matches API response", async () => {
          // Get the error message from UI
          const errorMessage = page.getByText(ERROR_MESSAGES.UPDATE_FAIL);
          const uiErrorText = await errorMessage.textContent();

          // Verify UI error message contains the API error message
          expect(uiErrorText).toContain(apiErrorResponse.message);

          // Also verify it matches input error message
          const inputErrorMessage = page.getByText(testCase.expectedError);
          expect(await inputErrorMessage.textContent()).toContain(
            testCase.expectedError,
          );
        });
      });
    });
  }

  // Parameterized test for user deletion
  for (const testCase of USER_DELETE_TEST_DATA) {
    test.describe(`Delete Users - ${testCase.caseId}`, () => {
      let testUsers: User[] = [];

      // Setup: Create multiple users before the test
      test.beforeEach(async ({ usersPage }) => {
        await test.step("Setup: Create test users via UI", async () => {
          for (const userData of testCase.users) {
            const user = await usersPage.createUserViaUI(
              userData.email,
              userData.password,
            );
            testUsers.push(user);
          }
          expect(testUsers.length).toBe(testCase.users.length);
        });
      });

      test(`TC_USER_007 - User delete users @TC_USER_007 @user @delete`, async ({
        usersPage,
      }) => {
        test.info().annotations.push({
          type: "description",
          description: testCase.description,
        });

        await test.step("User clicks the checkbox of users", async () => {
          for (const user of testUsers) {
            const deleteCheckbox = usersPage.getUserDeleteCheckbox(user.id);
            await deleteCheckbox.waitFor({ state: "visible", timeout: 5000 });
            await deleteCheckbox.click();
          }
        });

        await test.step('User clicks the "Delete selected" button in the bottom popup modal', async () => {
          await usersPage.deleteButton.click();
        });

        await test.step('User clicks the "Yes" button in the confirm modal', async () => {
          // Listen for DELETE API response
          await usersPage.waitForApiResponse(
            "DELETE",
            async () => await usersPage.confirmDeleteButton.click(),
          );
        });

        await test.step("User cannot see the information of deleted users in the list", async () => {
          // Verify all users are deleted from UI
          for (const user of testUsers) {
            const userElement = await usersPage.getUserByEmail(user.email);
            await expect(userElement).not.toBeVisible({ timeout: 5000 });
          }
        });
      });
    });
  }

  // Parameterized test for user sorting
  for (const testCase of USER_SORT_TEST_DATA) {
    test.describe(`Sort Users - ${testCase.caseId}`, () => {
      test.slow();
      let testUsers: User[] = [];

      test.beforeEach(async ({ usersPage }) => {
        await test.step("Setup: Create test users via UI", async () => {
          for (const userData of testCase.testUsers) {
            const user = await usersPage.createUserViaUI(
              userData.email,
              userData.password,
            );
            testUsers.push(user);
            await expect(
              await usersPage.getUserByEmail(user.email),
            ).toBeVisible();
          }
        });
      });

      test.afterEach(async ({ usersPage }) => {
        await test.step("User clicks the checkbox of users", async () => {
          for (const user of testUsers) {
            const deleteCheckbox = usersPage.getUserDeleteCheckbox(user.id);
            await deleteCheckbox.waitFor({ state: "visible", timeout: 5000 });
            await deleteCheckbox.click();
          }
        });

        await test.step('User clicks the "Delete selected" button in the bottom popup modal', async () => {
          await usersPage.deleteButton.click();
        });

        await test.step('User clicks the "Yes" button in the confirm modal', async () => {
          // Listen for DELETE API response
          await usersPage.waitForApiResponse(
            "DELETE",
            async () => await usersPage.confirmDeleteButton.click(),
          );
        });
      });

      test(`TC_USER_008 - User can sort users by ${testCase.sortField} @TC_USER_008 @user @sort`, async ({
        page,
        usersPage,
      }) => {
        test.info().annotations.push({
          type: "description",
          description: testCase.description,
        });

        await usersPage.waitForPageLoad();

        // STEP 1 — Click once → descending
        await test.step(`Click table header "${testCase.sortField}" to sort descending`, async () => {
          const response = await usersPage.waitForApiResponse(
            "GET",
            async () => await usersPage.clickTableHeader(testCase.sortField),
          );
          expect(response.status()).toBe(200);
        });

        // STEP 2 — Retrieve descending list
        const descendingItemList =
          await test.step("Capture the descending-sorted list", async () => {
            const values = await page
              .locator(`td.col-field-${testCase.sortLocator}`)
              .allTextContents();
            return values;
          });

        // STEP 3 — Validate descending sorting
        await test.step("Validate list is sorted descending", async () => {
          expect(isDescending(descendingItemList)).toBeTruthy();
        });

        // STEP 4 — Click again → ascending
        await test.step(`Click table header "${testCase.sortField}" again to sort ascending`, async () => {
          const response = await usersPage.waitForApiResponse(
            "GET",
            async () => await usersPage.clickTableHeader(testCase.sortField),
          );
          expect(response.status()).toBe(200);
        });

        // STEP 5 — Retrieve ascending list
        const ascendingItemList =
          await test.step("Capture the ascending-sorted list", async () => {
            const values = await page
              .locator(`td.col-field-${testCase.sortLocator}`)
              .allTextContents();
            return values;
          });

        // STEP 6 — Validate ascending sorting
        await test.step("Validate list is sorted ascending", async () => {
          expect(isAscending(ascendingItemList)).toBeTruthy();
        });
      });
    });
  }
});
