import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductPage extends BasePage {
  readonly productList: Locator;
  readonly productItems: Locator;
  readonly filterDropdown: Locator;
  readonly addToCartButtons: Locator;
  readonly removeButtons: Locator;
  readonly cartBadge: Locator;
  readonly productNames: Locator;
  readonly menuButton: Locator;
  readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    super(page);
    this.productList = page.locator('[data-test="inventory-list"]');
    this.productItems = page.locator('[data-test="inventory-item"]');
    this.filterDropdown = page.locator('[data-test="product-sort-container"]');
    this.addToCartButtons = page.locator('button[id^="add-to-cart"]');
    this.removeButtons = page.locator('button[id^="remove"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.productNames = page.locator('[data-test="inventory-item-name"]');
    this.menuButton = page.locator("#react-burger-menu-btn");
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
  }

  async isOnProductPage() {
    return this.page.url().includes("/inventory.html");
  }

  async getProductCount() {
    return await this.productItems.count();
  }

  async selectFilter(filterValue: string) {
    await this.filterDropdown.click();
    await this.filterDropdown.selectOption(filterValue);
  }

  async getProductPrice(index: number) {
    const product = this.productItems.nth(index);
    const priceText = await product
      .locator('[data-test="inventory-item-price"]')
      .textContent();
    return parseFloat(priceText?.replace("$", "") || "0");
  }

  async addProductToCart(index: number) {
    await this.addToCartButtons.nth(index).click();
  }

  async removeProductFromCart(index: number) {
    await this.removeButtons.nth(index).click();
  }

  async getCartBadgeCount() {
    const badgeText = await this.cartBadge.textContent();
    return parseInt(badgeText || "0");
  }

  async clickProductName(productName: string) {
    await this.page
      .locator(`[data-test="inventory-item-name"]`, { hasText: productName })
      .click();
  }

  async clickFirstProductName() {
    await this.productNames.first().click();
  }

  async resetAppState() {
    await this.menuButton.click();
    await this.resetAppStateLink.click();
  }

  async isCartBadgeVisible() {
    return await this.cartBadge.isVisible();
  }

  async navigateTo() {
    await this.goto("https://www.saucedemo.com/inventory.html");
    await this.waitForPageLoad();
  }
}
