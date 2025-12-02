import { Page, Locator } from "@playwright/test";
import { BasePage } from "@tests/pages/BasePage";

export class UsersPage extends BasePage {
  readonly newRecordButton: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly passwordConfirmField: Locator;
  readonly createButton: Locator;
  readonly usersList: Locator;
  readonly deleteButton: Locator;
  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.newRecordButton = page.getByRole("button", { name: "New Record" });
    this.emailField = page.getByRole("textbox", { name: " email *" });
    this.passwordField = page.getByRole("textbox", { name: " Password *" });
    this.passwordConfirmField = page.getByRole("textbox", {
      name: " Password confirm *",
    });
    this.createButton = page.getByRole("button", { name: "Create" });
    this.usersList = page.locator(".list-item");
    this.deleteButton = page.getByRole("button", { name: "Delete selected" });
    this.confirmDeleteButton = page.getByRole("button", { name: "Yes" });
  }

  async navigateTo() {
    await this.page.goto("#/collections/users");
  }

  async createUser(email: string, password: string, passwordConfirm: string) {
    await this.newRecordButton.click();
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.passwordConfirmField.fill(passwordConfirm);
    await this.createButton.click();
  }

  async getUserByEmail(email: string): Promise<Locator> {
    return this.page.getByText(email);
  }

  async isUserVisible(email: string): Promise<boolean> {
    try {
      const user = await this.getUserByEmail(email);
      return await user.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  getUserDeleteCheckbox(id: string) {
    return this.page.locator(`label[for="checkbox_${id}"]`);
  }
}
