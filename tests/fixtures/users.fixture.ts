import { test as base } from "@playwright/test";
import { UsersPage } from "@tests/pages/UsersPage";

type UsersFixtures = {
  usersPage: UsersPage;
};

export const test = base.extend<UsersFixtures>({
  usersPage: async ({ page }, use) => {
    const usersPage = new UsersPage(page);
    await usersPage.navigateTo();
    await use(usersPage);
  },
});

export { expect } from "@playwright/test";
