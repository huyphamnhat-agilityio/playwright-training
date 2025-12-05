import { test, expect } from "@tests/fixtures/users.fixture";

test.describe("User Delete Tests", () => {
  test.slow();
  // TC_USER_007: User can delete users
  test(
    `TC_USER_007 - User can delete other users`,
    {
      tag: ["@TC_USER_007", "@user", "@delete"],
    },
    async ({ deleteUsersPage }) => {
      await test.step("User clicks the checkbox of users", async () => {
        for (const user of deleteUsersPage.userList) {
          const deleteCheckbox = deleteUsersPage.getUserDeleteCheckbox(user.id);
          await deleteCheckbox.waitFor({ state: "visible", timeout: 5000 });
          await deleteCheckbox.click();
        }
      });

      await test.step('User clicks the "Delete selected" button in the bottom popup modal', async () => {
        await deleteUsersPage.deleteButton.click();
      });

      await test.step('User clicks the "Yes" button in the confirm modal and verifies deletion', async () => {
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
        for (const user of deleteUsersPage.userList) {
          const userElement = await deleteUsersPage.getUserByEmail(user.email);
          await expect(userElement).not.toBeVisible({ timeout: 5000 });
        }
      });
    },
  );
});
