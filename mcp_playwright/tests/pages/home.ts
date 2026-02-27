import { Page } from '@playwright/test';
import { storeValues } from '../support/constant';

export class HomePage {
  constructor(private page: Page) {}

  cssItemSelector(itemPosition: string) {
    return `[class="inventory_list"] [class="inventory_item"]:nth-of-type(${itemPosition})`;
  }

  async storeSelectedValues(itemPosition: string) {
    const priceValue = await this.page.textContent(
      `${this.cssItemSelector(itemPosition)} [class="inventory_item_price"]`,
    );
    const name = await this.page.textContent(
      `${this.cssItemSelector(itemPosition)} [class="inventory_item_label"] > a > div`,
    );

    storeValues.push({ name: itemPosition, title: name, price: priceValue });
  }

  async selectItem(itemPosition: string) {
    await this.storeSelectedValues(itemPosition);
    await this.page.locator(`${this.cssItemSelector(itemPosition)} button`).click();
  }

  async goToShoppingCart() {
    await this.page.locator('[id="shopping_cart_container"] > a').click();
  }

  async selectRandomItems(itemRandomItems: number) {
    for (let i = 1; i <= itemRandomItems; i++) {
      await this.selectItem(i.toString());
    }
  }
}
