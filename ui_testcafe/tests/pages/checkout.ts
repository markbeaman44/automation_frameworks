import { Selector, t } from 'testcafe';
import { storeValues } from '../support/constant';

async function searchArrayInList(nameKey: string, myArray: any) {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].name === nameKey) {
      return myArray[i];
    }
  }
}

// ASSERTSIONS //
async function validateItemsInCart(storedValues: any) {
  const getItem = Selector('div').withText(storedValues.title).parent('[class="cart_item"]');

  const nameResult = getItem.find('[class="inventory_item_name"]').textContent;
  await t.expect(nameResult).contains(storedValues.title);

  const priceResult = getItem.find('[class="inventory_item_price"]').textContent;
  await t.expect(priceResult).contains(storedValues.price);
}

export async function ValidateTotalCart(itemTotal: string) {
  const results = Selector('[class="cart_item"]').count;
  await t.expect(results).eql(Number(itemTotal));
}

export async function ValidateItemInCart(itemValue: string) {
  const storedValues = await searchArrayInList(itemValue, storeValues);
  await validateItemsInCart(storedValues);
}

export async function ValidatesAllInCart() {
  for (let i = 0; i < storeValues.length; i++) {
    await validateItemsInCart(storeValues[i]);
  }
}
