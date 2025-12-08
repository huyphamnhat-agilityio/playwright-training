import { USER_SEARCH_TEST_DATA } from "@tests/constants";
import { expect, test } from "@tests/fixtures/users.fixture";
import { ApiResponse } from "@tests/types";

test.describe("User Search Tests", () => {
  test.slow();
  test(`TC_USERS_009 - Case 1 - User can search user by email`, async ({
    searchUsersPage,
  }) => {
    const expectedUser = USER_SEARCH_TEST_DATA[0];
    await searchUsersPage.waitForPageLoad();

    // User fill the search input with value
    await test.step(`User focus and fill the search input with value`, async () => {
      await searchUsersPage.searchInput.fill(expectedUser.email);
    });

    // User click the search button
    await test.step(`User click the search button and verify API response that match with UI result`, async () => {
      const response = await searchUsersPage.waitForApiResponse(
        "GET",
        async () => await searchUsersPage.searchButton.click(),
      );

      const apiResult: ApiResponse<{ id: string }> = await response.json();

      // Collect the ID of user returned from API
      const userId = apiResult.items[0].id;

      // Expect it match with ID from UI
      await expect(searchUsersPage.page.getByText(userId)).toBeVisible();

      // Get all items from table
      const itemList = await searchUsersPage.table.getColumnValues("email");

      // Expect the user field has include in the UI
      const isItemExist = itemList.includes(expectedUser.email);

      expect(isItemExist).toBeTruthy();
    });
  });

  test(`TC_USERS_009 - Case 2 - User can search user by username`, async ({
    searchUsersPage,
  }) => {
    const expectedUser = USER_SEARCH_TEST_DATA[1];
    await searchUsersPage.waitForPageLoad();

    // User fill the search input with value
    await test.step(`User focus and fill the search input with value`, async () => {
      await searchUsersPage.searchInput.fill(expectedUser.username);
    });

    // User click the search button
    await test.step(`User click the search button and verify API response that match with UI result`, async () => {
      const response = await searchUsersPage.waitForApiResponse(
        "GET",
        async () => await searchUsersPage.searchButton.click(),
      );

      const apiResult: ApiResponse<{ id: string }> = await response.json();

      // Collect the ID of user returned from API
      const userId = apiResult.items[0].id;

      // Expect it match with ID from UI
      await expect(searchUsersPage.page.getByText(userId)).toBeVisible();

      // Get all items from table
      const itemList = await searchUsersPage.table.getColumnValues("username");

      // Expect the user field has include in the UI
      const isItemExist = itemList.includes(expectedUser.username);

      expect(isItemExist).toBeTruthy();
    });
  });
});
