import 'nightwatch';
import { storeValues } from '../support/constant';

function cssItemSelector(itemPosition: string) {
  return `[class="inventory_list"] [class="inventory_item"]:nth-of-type(${itemPosition})`;
}

async function storeSelectedValues(itemPosition: string) {
  const priceValue = browser.element(`${cssItemSelector(itemPosition)} [class="inventory_item_price"]`);
  const name = browser.element(`${cssItemSelector(itemPosition)} [class="inventory_item_label"] > a`);

  storeValues.push({ name: itemPosition, title: await name.getText(), price: await priceValue.getText() });
}

export async function selectItem(itemPosition: string) {
  await storeSelectedValues(itemPosition);
  await browser.element.find(`${cssItemSelector(itemPosition)} button`).click();
}

export async function goToShoppingCart() {
  await browser.element.find('[id="shopping_cart_container"]').click();
}

export async function selectRandomItems(itemRandomItems: number) {
  for (let i = 1; i <= itemRandomItems; i++) {
    await selectItem(i.toString());
  }
}
