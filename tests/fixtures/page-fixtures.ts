import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

// Define custom fixture types
type CustomFixtures = {
  loginPage: LoginPage;
};

// Extend base test with custom fixtures
export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from "@playwright/test";
