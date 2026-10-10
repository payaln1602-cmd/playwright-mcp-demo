import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('SauceDemo', () => {
  test('successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.expectLoaded();
    await expect(page.getByRole('button', { name: /^Cart/i })).toBeVisible();
  });

  test('locked-out user sees an error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('locked_out_user', 'secret_sauce');

    await loginPage.expectLockedOutError();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('add two products to the cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.addProduct('Sauce Labs Backpack');
    await inventoryPage.addProduct('Sauce Labs Bike Light');

    await expect(page.getByRole('button', { name: /^Cart, 2 items/i })).toBeVisible();
    await inventoryPage.openCart();
    await cartPage.expectItemCount(2);
  });

  test('complete checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.addProduct('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();

    await checkoutPage.fillCustomerInformation('Jane', 'Doe', '98101');
    await checkoutPage.finishOrder();
    await checkoutPage.expectConfirmation();
  });
});
