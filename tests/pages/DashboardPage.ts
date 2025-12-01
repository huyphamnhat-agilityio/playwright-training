import { Page, Locator } from "@playwright/test";
import { BasePage } from "@tests/pages/BasePage";

export class DashboardPage extends BasePage {
  readonly pageTitle: Locator;
  readonly sidebar: Locator;
  readonly collectionsLink: Locator;
  readonly userMenuButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator(".page-header h4, h1");
    this.sidebar = page.locator(".page-sidebar");
    this.collectionsLink = page.locator('a[href*="collections"]');
    this.userMenuButton = page.getByRole("button", {
      name: "Logged superuser menu",
    });
    this.logoutButton = page.getByRole("menuitem", { name: "Logout" });
  }

  async isOnDashboard(): Promise<boolean> {
    const url = this.page.url();
    return url.includes("collections");
  }

  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) || "";
  }
}
