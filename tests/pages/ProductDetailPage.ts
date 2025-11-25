import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.productDescription = page.locator('[data-test="inventory-item-desc"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.productImage = page.locator('[data-test="item-sauce-card-image"]');
    this.addToCartButton = page.locator('button[id^="add-to-cart"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
  }

  async isOnProductDetailPage() {
    return this.page.url().includes("/inventory-item.html");
  }

  async isProductDetailVisible() {
    return (
      (await this.productName.isVisible()) &&
      (await this.productDescription.isVisible()) &&
      (await this.productPrice.isVisible())
    );
  }
}
