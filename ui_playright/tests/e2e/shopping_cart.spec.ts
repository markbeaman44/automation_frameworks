import { test } from '@playwright/test';
import { storeValues } from '../support/constant';
import { LoginPage } from '../pages/login';
import { HomePage } from '../pages/home';
import { CheckoutPage } from '../pages/checkout';

const positions = ['1st', '2nd', '3rd'];
const valueSelected = ['3', '5'];
const user = 'standard_user';
const password = 'secret_sauce';

test.describe('Shopping Cart - checkout and remove items from shopping cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await new LoginPage(page).login(user, password);
  });
  test.afterEach(async ({ page }) => {
    await new LoginPage(page).logout();
    await page.context().clearCookies();
    await storeValues.splice(0, storeValues.length);
  });

  for (const position of positions) {
    test(`Successfully adds ${position} item to the shopping cart`, async ({ page }) => {
      const home = new HomePage(page);
      const checkout = new CheckoutPage(page);
      await home.selectItem(position.replace(/[^0-9]/g, ''));
      await home.goToShoppingCart();
      await checkout.ValidateTotalCart('1');
      await checkout.ValidateItemInCart(position.replace(/[^0-9]/g, ''));
    });
  }

  for (const value of valueSelected) {
    test(`Successfully adds multiples of ${value} in the shopping cart`, async ({ page }) => {
      const home = new HomePage(page);
      const checkout = new CheckoutPage(page);
      await home.selectRandomItems(Number(value));
      await home.goToShoppingCart();
      await checkout.ValidateTotalCart(value.replace(/[^0-9]/g, ''));
      await checkout.ValidatesAllInCart();
    });
  }
});
