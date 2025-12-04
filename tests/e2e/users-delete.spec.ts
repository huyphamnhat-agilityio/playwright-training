import { test, expect } from "@tests/fixtures/users.fixture";
import { USER_DELETE_TEST_DATA } from "@tests/constants/user-test-data";
import { User } from "@tests/types";

test.describe("User Delete Tests", () => {
  test.slow();

  // TC_USER_007: User can delete users
  for (const testCase of USER_DELETE_TEST_DATA) {
    test.describe(`Delete Users - ${testCase.caseId}`, () => {
      // Configure to run serially to avoid conflicts
      test.describe.configure({ mode: "serial" });

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

      test(`TC_USER_007 - User delete users @TC_USER_007`, async ({
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

        await test.step('User clicks the "Yes" button in the confirm modal and verifies deletion', async () => {
          // Listen for DELETE API response
          const deleteResponse = await usersPage.waitForApiResponse(
            "DELETE",
            async () => await usersPage.confirmDeleteButton.click(),
          );

          // Verify DELETE API response
          expect(deleteResponse.status()).toBe(204);
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
});
