import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { AUTH_STATE_PATH } from "../config/browsers";

setup("authenticate", async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Perform authentication steps
  await loginPage.navigateTo();
  await loginPage.login("standard_user", "secret_sauce");

  // Wait until the page receives the cookies
  await expect(page).toHaveURL(/.*inventory\.html/);

  // End of authentication steps
  await page.context().storageState({ path: AUTH_STATE_PATH });
});
