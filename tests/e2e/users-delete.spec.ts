import { ERROR_MESSAGES } from "@tests/constants";
import { test, expect } from "@tests/fixtures/users.fixture";

test.describe("User Delete Tests", () => {
  test.describe.configure({ mode: "serial" });
  test.slow();
  let testUser: { email: string; id: string };
  // TC_USERS_007: User can delete users
  test(
    `TC_USERS_007 - User can delete a single user`,
    {
      tag: ["@TC_USERS_007", "@user", "@delete"],
    },
    async ({ deleteUsersPage }) => {
      await deleteUsersPage.navigateTo();
      await test.step("User clicks the checkbox of a user", async () => {
        testUser = deleteUsersPage.userList[0];

        const deleteCheckbox = deleteUsersPage.getUserDeleteCheckbox(
          testUser.id,
        );

        await deleteCheckbox.waitFor({ state: "visible", timeout: 5000 });
        await deleteCheckbox.click();
      });

      await test.step('User clicks the "Delete selected" button in the bottom popup modal', async () => {
        await deleteUsersPage.deleteButton.click();
      });

      await test.step('User clicks the "Yes" button in the confirm modal', async () => {
        // Listen for DELETE API response
        const deleteResponse = await deleteUsersPage.waitForApiResponse(
          "DELETE",
          async () => await deleteUsersPage.confirmDeleteButton.click(),
        );

        // Verify DELETE API response
        expect(deleteResponse.status()).toBe(204);
      });

      await test.step("User cannot see the information of deleted users in the list", async () => {
        // Verify all users are deleted from UI
        const userElement = await deleteUsersPage.getUserByEmail(
          testUser.email,
        );
        await expect(userElement).not.toBeVisible({ timeout: 5000 });
      });
    },
  );

  test(
    `TC_USERS_007 - User can delete multiple users`,
    {
      tag: ["@TC_USERS_007", "@user", "@delete"],
    },
    async ({ deleteUsersPage }) => {
      await deleteUsersPage.navigateTo();

      await test.step("User clicks the table header checkbox", async () => {
        for (const testUser of deleteUsersPage.userList) {
          const deleteCheckbox = deleteUsersPage.getUserDeleteCheckbox(
            testUser.id,
          );

          await deleteCheckbox.waitFor({ state: "visible", timeout: 5000 });

          await deleteCheckbox.click();
        }
      });

      await test.step('User clicks the "Delete selected" button in the bottom popup modal', async () => {
        await deleteUsersPage.deleteButton.click();
      });

      await test.step('User clicks the "Yes" button in the confirm modal', async () => {
        // Listen for DELETE API response
        const deleteResponse = await deleteUsersPage.waitForApiResponse(
          "DELETE",
          async () => await deleteUsersPage.confirmDeleteButton.click(),
        );

        // Verify DELETE API response
        expect(deleteResponse.status()).toBe(204);
      });

      await test.step(`The user list is empty with a message: ${ERROR_MESSAGES.NO_RECORDS}`, async () => {
        // Verify all users are deleted from UI
        for (const testUser of deleteUsersPage.userList) {
          // Verify all users are deleted from UI
          const userElement = await deleteUsersPage.getUserByEmail(
            testUser.email,
          );
          await expect(userElement).not.toBeVisible({ timeout: 5000 });
        }
      });
    },
  );
});
