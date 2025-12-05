import { USER_SORT_TEST_DATA } from "@tests/constants";
import { test, expect } from "@tests/fixtures/users.fixture";
import { isAscending, isDescending } from "@tests/utils/validation";

test.describe("User Sort Tests", () => {
  test.slow();

  for (const options of USER_SORT_TEST_DATA.sortOptions) {
    test(
      `TC_USER_008 - Verify sorting users by "${options.field}"`,
      {
        tag: ["@TC_USER_008", "@user", "@sort"],
      },
      async ({ sortUsersPage }) => {
        await sortUsersPage.waitForPageLoad();

        // STEP 1 — Trigger DESC sorting
        await test.step(`Click the "${options.field}" column header to sort in descending order`, async () => {
          const response = await sortUsersPage.waitForApiResponse(
            "GET",
            async () => await sortUsersPage.table.clickHeader(options.field),
          );

          expect(response.status()).toBe(200);
        });

        // STEP 2 — Capture DESC results
        const descendingItemList =
          await test.step(`Retrieve the values sorted in descending order for "${options.field}"`, async () =>
            await sortUsersPage.table.getColumnValues(options.locator));

        // STEP 3 — Validate DESC sorting
        await test.step(`Verify that the values are correctly sorted in descending order`, async () => {
          expect(isDescending(descendingItemList)).toBeTruthy();
        });

        // STEP 4 — Trigger ASC sorting
        await test.step(`Click the "${options.field}" column header again to sort in ascending order`, async () => {
          const response = await sortUsersPage.waitForApiResponse(
            "GET",
            async () => await sortUsersPage.table.clickHeader(options.field),
          );

          expect(response.status()).toBe(200);
        });

        // STEP 5 — Capture ASC results
        const ascendingItemList =
          await test.step(`Retrieve the values sorted in ascending order for "${options.field}"`, async () =>
            await sortUsersPage.table.getColumnValues(options.locator));

        // STEP 6 — Validate ASC sorting
        await test.step(`Verify that the values are correctly sorted in ascending order`, async () => {
          expect(isAscending(ascendingItemList)).toBeTruthy();
        });
      },
    );
  }
});
