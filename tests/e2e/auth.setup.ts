import { test as setup } from "@tests/fixtures/auth.fixture";
import { AUTH_STATE_PATH } from "@tests/config/browsers";
import { VALID_CREDENTIALS } from "@tests/constants/auth-credentials";

setup("authenticate", async ({ loginPage, page }) => {
  await loginPage.navigateTo();

  // Perform authentication steps
  await loginPage.login(VALID_CREDENTIALS.email, VALID_CREDENTIALS.password);

  // End of authentication steps
  await page.context().storageState({ path: AUTH_STATE_PATH });
});
