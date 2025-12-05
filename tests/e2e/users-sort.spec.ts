import { USER_SORT_TEST_DATA } from "@tests/constants";
import { test, expect } from "@tests/fixtures/users.fixture";
import { isAscending, isDescending } from "@tests/utils/validation";

test.describe("User Sort Tests", () => {
  test.slow();

  // TC_USER_008: User can sort users
  test.describe(`Sort Users`, () => {
    test.slow();

    for (const options of USER_SORT_TEST_DATA.sortOptions) {
      test(`TC_USER_008 - User can sort users by ${options.field}`, async ({
        sortUsersPage,
      }) => {
        await sortUsersPage.waitForPageLoad();

        // STEP 1 — Click once → descending
        await test.step(`Click table header "${options.field}" to sort descending`, async () => {
          const response = await sortUsersPage.waitForApiResponse(
            "GET",
            async () => await sortUsersPage.clickTableHeader(options.field),
          );

          expect(response.status()).toBe(200);
        });

        // STEP 2 — Retrieve descending list
        const descendingItemList =
          await test.step("Capture the descending-sorted list", async () => {
            const values = await sortUsersPage.page
              .locator(`td.col-field-${options.locator}`)
              .allTextContents();
            return values;
          });

        // STEP 3 — Validate descending sorting
        await test.step("Validate list is sorted descending", async () => {
          expect(isDescending(descendingItemList)).toBeTruthy();
        });

        // STEP 4 — Click again → ascending
        await test.step(`Click table header "${options.field}" again to sort ascending`, async () => {
          const response = await sortUsersPage.waitForApiResponse(
            "GET",
            async () => await sortUsersPage.clickTableHeader(options.field),
          );
          expect(response.status()).toBe(200);
        });

        // STEP 5 — Retrieve ascending list
        const ascendingItemList =
          await test.step("Capture the ascending-sorted list", async () => {
            const values = await sortUsersPage.page
              .locator(`td.col-field-${options.locator}`)
              .allTextContents();
            return values;
          });

        // STEP 6 — Validate ascending sorting
        await test.step("Validate list is sorted ascending", async () => {
          expect(isAscending(ascendingItemList)).toBeTruthy();
        });
      });
    }
  });
});
