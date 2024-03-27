import { Selector, t } from 'testcafe';
import { storeValues } from '../support/constant';

function cssItemSelector(itemPosition: string) {
  return `[class="inventory_list"] [class="inventory_item"]:nth-of-type(${itemPosition})`;
}

async function storeSelectedValues(itemPosition: string) {
  const priceValue = Selector(`${cssItemSelector(itemPosition)} [class="inventory_item_price"]`);
  const name = Selector(`${cssItemSelector(itemPosition)} [class="inventory_item_label"] > a`);

  storeValues.push({ name: itemPosition, title: await name.textContent, price: await priceValue.textContent });
}

export async function selectItem(itemPosition: string) {
  await storeSelectedValues(itemPosition);
  await t.click(`${cssItemSelector(itemPosition)} button`);
}

export async function goToShoppingCart() {
  await t.click('[id="shopping_cart_container"]');
}

export async function selectRandomItems(itemRandomItems: number) {
  for (let i = 1; i <= itemRandomItems; i++) {
    await selectItem(i.toString());
  }
}
