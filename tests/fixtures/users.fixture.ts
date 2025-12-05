import { test as base } from "@playwright/test";
import { USER_DELETE_TEST_DATA, USER_SORT_TEST_DATA } from "@tests/constants";
import { UsersPage } from "@tests/pages/UsersPage";
import { createUser, deleteUser } from "@tests/services";

type UsersFixtures = {
  usersPage: UsersPage;
  deleteUsersPage: UsersPage & {
    userList: { email: string; id: string }[];
  };
  sortUsersPage: UsersPage & {
    userList: { email: string; id: string }[];
    sortOptions: { field: string; locator: string }[];
  };
};

export const test = base.extend<UsersFixtures>({
  usersPage: async ({ page }, use) => {
    const usersPage = new UsersPage(page);
    await usersPage.navigateTo();
    await use(usersPage);
  },
  deleteUsersPage: async ({ page }, use) => {
    const usersPage = new UsersPage(page);

    const userList: { email: string; id: string }[] = [];

    // Prepare data before delete test
    for (const payload of USER_DELETE_TEST_DATA) {
      const user = await createUser({
        ...payload,
        passwordConfirm: payload.password,
      });

      if (user) {
        userList.push({ email: user.email, id: user.id });
      }
    }

    await usersPage.navigateTo();

    // Pass a combined object into the fixture
    await use(Object.assign(usersPage, { userList }));
  },
  sortUsersPage: async ({ page }, use) => {
    const usersPage = new UsersPage(page);

    const userList: { email: string; id: string }[] = [];

    // Prepare data before sort test
    for (const payload of USER_SORT_TEST_DATA.testUsers) {
      const user = await createUser({
        ...payload,
        passwordConfirm: payload.password,
      });

      if (user) {
        userList.push({ email: user.email, id: user.id });
      }
    }

    await usersPage.navigateTo();

    // Pass a combined object into the fixture
    await use(
      Object.assign(usersPage, {
        userList,
        sortOptions: USER_SORT_TEST_DATA.sortOptions,
      }),
    );

    // Clear user data after test
    for (const { id } of userList) {
      await deleteUser(id);
    }
  },
});

export { expect } from "@playwright/test";
