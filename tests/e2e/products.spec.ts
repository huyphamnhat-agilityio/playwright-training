import { test, expect } from "../fixtures/page-fixtures";

test.describe("Product Test Suite", () => {
  test("TC_PRODUCTS_001: User can see the product list", async ({
    productPage,
  }) => {
    // Step: 1. User stays in product page
    const isOnProductPage = await productPage.isOnProductPage();
    expect(isOnProductPage).toBeTruthy();

    // Expected Result: User can see the product list
    await expect(productPage.productList).toBeVisible();
    const productCount = await productPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test("TC_PRODUCTS_002: User can filter product by price(from high to low)", async ({
    productPage,
  }) => {
    // Steps:
    // 1. User stays in product page
    const isOnProductPage = await productPage.isOnProductPage();
    expect(isOnProductPage).toBeTruthy();

    // 2. User clicks filter select list
    // 3. User chooses select item with value: Price (high to low)
    await productPage.selectFilter("hilo");

    // Expected Result: User can see the first product price is higher than the second one in the product list
    const firstPrice = await productPage.getProductPrice(0);
    const secondPrice = await productPage.getProductPrice(1);
    expect(firstPrice).toBeGreaterThan(secondPrice);
  });

  test("TC_PRODUCTS_003: User can add products to cart", async ({
    productPage,
  }) => {
    // Steps:
    // 1. User stays in product page
    const isOnProductPage = await productPage.isOnProductPage();
    expect(isOnProductPage).toBeTruthy();

    // 2. User clicks the "Add to cart" button of the first product card
    await productPage.addProductToCart(0);

    // Verify badge count increased to 1
    await expect(productPage.cartBadge).toBeVisible();
    let badgeCount = await productPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);

    // 3. User clicks the "Add to cart" button of the second product card
    await productPage.addProductToCart(1);

    // Expected Result: User can see the badge icon of cart button increase to 2
    badgeCount = await productPage.getCartBadgeCount();
    expect(badgeCount).toBe(2);
  });

  test("TC_PRODUCTS_004: User can remove products from cart", async ({
    productPage,
  }) => {
    // Steps:
    // 1. User stays in product page
    const isOnProductPage = await productPage.isOnProductPage();
    expect(isOnProductPage).toBeTruthy();

    // Add two products first
    await productPage.addProductToCart(0);
    await productPage.addProductToCart(1);
    let badgeCount = await productPage.getCartBadgeCount();
    expect(badgeCount).toBe(2);

    // 2. User clicks the "Remove" button of the second product card
    await productPage.removeProductFromCart(1);

    // Expected Result: User can see the badge icon of cart button decrease to 1
    badgeCount = await productPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);
  });

  test("TC_PRODUCTS_005: User can navigate to product detail page", async ({
    productPage,
    page,
  }) => {
    // Steps:
    // 1. User stays in product page
    const isOnProductPage = await productPage.isOnProductPage();
    expect(isOnProductPage).toBeTruthy();

    // 2. User clicks the product label name
    await productPage.clickFirstProductName();

    // Expected Result: User navigates to product detail page with the product information detail
    await expect(page).toHaveURL(/.*inventory-item\.html/);
    await expect(
      page.locator('[data-test="inventory-item-name"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-test="inventory-item-desc"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-test="inventory-item-price"]'),
    ).toBeVisible();
  });

  test("TC_PRODUCTS_006: User can remove all product from carts", async ({
    productPage,
  }) => {
    // Steps:
    // 1. User stays in product page
    const isOnProductPage = await productPage.isOnProductPage();
    expect(isOnProductPage).toBeTruthy();

    // Add products to cart first
    await productPage.addProductToCart(0);
    await productPage.addProductToCart(1);
    await expect(productPage.cartBadge).toBeVisible();

    // 2. User opens the sidebar by click on the sidebar icon
    // 3. User clicks "Reset App State" label
    await productPage.resetAppState();

    // Expected Result: User can no longer see the badge icon of cart button
    const isBadgeVisible = await productPage.isCartBadgeVisible();
    expect(isBadgeVisible).toBeFalsy();
  });
});
