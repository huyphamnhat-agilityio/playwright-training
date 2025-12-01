import { test as base } from "@playwright/test";
import { LoginPage } from "@tests/pages/LoginPage";
import { DashboardPage } from "@tests/pages/DashboardPage";

type AuthFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  authenticatedPage: { loginPage: LoginPage; dashboardPage: DashboardPage };
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});

export { expect } from "@playwright/test";
