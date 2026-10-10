import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly productsHeading: Locator;
  readonly cartButton: Locator;

  constructor(private readonly page: Page) {
    this.productsHeading = page.getByText('Products', { exact: true });
    this.cartButton = page.getByRole('button', { name: /^Cart/i });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
    await expect(this.productsHeading).toBeVisible();
  }

  async addProduct(productName: string) {
    const productCard = this.page.locator('.inventory_item').filter({
      has: this.page.getByText(productName, { exact: true }),
    });

    await productCard.getByRole('button', { name: 'Add to cart' }).click();
  }

  async openCart() {
    await this.cartButton.click();
  }
}
