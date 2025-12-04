import { test, expect } from "@tests/fixtures/users.fixture";
import { USER_SORT_TEST_DATA } from "@tests/constants/user-test-data";
import { User } from "@tests/types";
import { isAscending, isDescending } from "@tests/utils/validation";

test.describe("User Sort Tests", () => {
  test.slow();

  // TC_USER_008: User can sort users
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
