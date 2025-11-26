import { test as base } from "@playwright/test";

// Pages
import { LoginPage } from "../pages/LoginPage";
import { ProductPage } from "./../pages/ProductPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

// Define custom fixture types
type CustomFixtures = {
  loginPage: LoginPage;
  productPage: ProductPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

// Extend base test with custom fixtures
// Note: Authentication is handled globally via auth.setup.ts
export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await productPage.navigateTo();
    await use(productPage);
  },

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from "@playwright/test";
