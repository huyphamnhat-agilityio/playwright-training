import { USER_SORT_TEST_DATA } from "@tests/constants";
import { test, expect } from "@tests/fixtures/users.fixture";
import { isAscending, isDescending } from "@tests/utils/validation";

test.describe("User Sort Tests", () => {
  test.slow();

  test.describe.configure({ mode: "serial" });
  for (const options of USER_SORT_TEST_DATA.sortOptions) {
    test(
      `User can sort users by "${options.field}"`,
      {
        tag: ["@TC_USERS_008", "@user", "@sort"],
      },
      async ({ sortUsersPage }) => {
        await sortUsersPage.waitForPageLoad();

        await test.step(`User click the "${options.field}" column header of the user table to sort in descending order`, async () => {
          const response = await sortUsersPage.waitForApiResponse(
            "GET",
            async () => await sortUsersPage.table.clickHeader(options.field),
          );

          expect(response.status()).toBe(200);
        });

        await test.step(`User can see the list of users in descending order by ${options.field}"`, async () => {
          const descendingItemList = await sortUsersPage.table.getColumnValues(
            options.locator,
          );
          expect(isDescending(descendingItemList)).toBeTruthy();
        });

        await test.step(`User click the "${options.field}" column header of the user table again to sort in ascending order`, async () => {
          const response = await sortUsersPage.waitForApiResponse(
            "GET",
            async () => await sortUsersPage.table.clickHeader(options.field),
          );

          expect(response.status()).toBe(200);
        });

        await test.step(`User can see the list of users in ascending order by ${options.field}"`, async () => {
          const ascendingItemList = await sortUsersPage.table.getColumnValues(
            options.locator,
          );
          expect(isAscending(ascendingItemList)).toBeTruthy();
        });
      },
    );
  }
});
