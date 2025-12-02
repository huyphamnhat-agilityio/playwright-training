import { expect, test as setup } from "@tests/fixtures/auth.fixture";
import { AUTH_STATE_PATH } from "@tests/config/browsers";
import { VALID_CREDENTIALS } from "@tests/constants/auth-credentials";
import { LoginPage } from "@tests/pages/LoginPage";
import { UI_ELEMENTS } from "@tests/constants";

setup("authenticate", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateTo();

  // Perform authentication steps
  await loginPage.login(VALID_CREDENTIALS.email, VALID_CREDENTIALS.password);

  const dashboardLogo = page.getByRole("link", {
    name: UI_ELEMENTS.POCKETBASE_LOGO,
  });

  await expect(dashboardLogo).toBeVisible();

  // End of authentication steps
  await page.context().storageState({ path: AUTH_STATE_PATH });
});
