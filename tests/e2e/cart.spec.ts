import { test, expect } from "../fixtures/page-fixtures";

test.describe("Cart Test Suite", { tag: "@cart" }, () => {
  test("TC_CART_001: User can navigate to cart page", async ({
    productPage,
    cartPage,
  }) => {
    // Pre-condition: User has added at least one product to cart
    await productPage.addProductToCart(0);
    await expect(productPage.cartBadge).toBeVisible();

    // Step: 1. User click the cart icon on header
    await cartPage.navigateToCart();

    // Expected Result: User navigate to cart page and see the cart list
    const isOnCartPage = await cartPage.isOnCartPage();
    expect(isOnCartPage).toBeTruthy();
    await expect(cartPage.cartItems).toHaveCount(1);
  });

  test("TC_CART_002: User can checkout from cart", async ({
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    // Pre-condition: User has at least one product in cart and stays in cart page
    await productPage.addProductToCart(0);
    await cartPage.navigateToCart();
    const isOnCartPage = await cartPage.isOnCartPage();
    expect(isOnCartPage).toBeTruthy();

    // Steps:
    // 1. User click the checkout button
    await cartPage.proceedToCheckout();

    // Verify on checkout step one
    const isOnCheckoutStepOne = await checkoutPage.isOnCheckoutStepOne();
    expect(isOnCheckoutStepOne).toBeTruthy();

    // 2. User fill all the information on Checkout information form with any string value
    await checkoutPage.fillCheckoutInformation("John", "Doe", "12345");

    // 3. User click continue to Checkout confirmation page
    await checkoutPage.clickContinue();

    // Verify on checkout step two
    const isOnCheckoutStepTwo = await checkoutPage.isOnCheckoutStepTwo();
    expect(isOnCheckoutStepTwo).toBeTruthy();

    // 4. User click finish button
    await checkoutPage.clickFinish();

    // Expected Result: User navigate to Checkout complete page
    // with thank you message and all the cart item are removed,
    // user can no longer see the badge icon on cart button
    const isOnCheckoutComplete = await checkoutPage.isOnCheckoutComplete();
    expect(isOnCheckoutComplete).toBeTruthy();
    await expect(checkoutPage.completeHeader).toBeVisible();
    await expect(checkoutPage.completeHeader).toContainText("Thank you");

    const isBadgeVisible = await checkoutPage.isCartBadgeVisible();
    expect(isBadgeVisible).toBeFalsy();
  });
});
