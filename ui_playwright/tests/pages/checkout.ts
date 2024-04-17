import { Page, expect } from '@playwright/test';
import { storeValues } from '../support/constant';

async function searchArrayInList(nameKey: string, myArray: any) {
  return myArray.filter((i: any) =>  i.name === nameKey )[0]
}

export class CheckoutPage {
  constructor(private page: Page) {}
  // ASSERTSIONS //

  async validateItemsInCart(storedValues: any) {
    const nameResult = await this.page.locator('[class="inventory_item_name"]', {
      has: this.page.locator(`text=${storedValues.title}`),
    });
    await expect(nameResult).toContainText(storedValues.title);

    const priceResult = await this.page.locator('[class="cart_item"]', {
      has: this.page.locator(`text=${storedValues.title}`),
    });
    await expect(priceResult).toContainText(storedValues.price);
  }

  async ValidateTotalCart(itemTotal: string) {
    const results = this.page.locator('[class="cart_item"]');
    await expect(results).toHaveCount(Number(itemTotal));
  }

  async ValidateItemInCart(itemValue: string) {
    const storedValues = await searchArrayInList(itemValue, storeValues);
    await this.validateItemsInCart(storedValues);
  }

  async ValidatesAllInCart() {
    for (let i = 0; i < storeValues.length; i++) {
      await this.validateItemsInCart(storeValues[i]);
    }
  }
}
