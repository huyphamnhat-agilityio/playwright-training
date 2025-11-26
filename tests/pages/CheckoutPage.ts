import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async fillCheckoutInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async clickFinish() {
    await this.finishButton.click();
  }

  async isOnCheckoutStepOne() {
    return this.page.url().includes("/checkout-step-one.html");
  }

  async isOnCheckoutStepTwo() {
    return this.page.url().includes("/checkout-step-two.html");
  }

  async isOnCheckoutComplete() {
    return this.page.url().includes("/checkout-complete.html");
  }

  async isCartBadgeVisible() {
    return await this.cartBadge.isVisible();
  }
}
