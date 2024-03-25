import { storeValues } from '../support/constant.js';

function cssItemSelector(itemPosition: string) {
  return `[class="inventory_list"] [class="inventory_item"]:nth-of-type(${itemPosition})`;
}

async function storeSelectedValues(itemPosition: string) {
  const priceValue = await browser.$(`${cssItemSelector(itemPosition)} [class="inventory_item_price"]`).getText();
  const name = await browser.$(`${cssItemSelector(itemPosition)} [class="inventory_item_label"] > a`).getText();

  await storeValues.push({ name: itemPosition, title: name, price: priceValue });
}

export async function selectItem(itemPosition: string) {
  await storeSelectedValues(itemPosition);
  await browser.$(`${cssItemSelector(itemPosition)} button`).click();
}

export async function goToShoppingCart() {
  await browser.$('[id="shopping_cart_container"]').click();
}

export async function selectRandomItems(itemRandomItems: number) {
  for (let i = 1; i <= itemRandomItems; i++) {
    await selectItem(i.toString());
  }
}
