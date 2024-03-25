import { storeValues } from '../support/constant.js';

async function searchArrayInList(nameKey: string, myArray: any) {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].name === nameKey) {
      return myArray[i];
    }
  }
}

async function removeArrayInList(nameKey: string, myArray: any) {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].name === nameKey) {
      return myArray.splice(i, 1);
    }
  }
}

export async function removeItem(itemPosition: string) {
  const storedValues = await searchArrayInList(itemPosition, storeValues);

  await browser.$(storedValues.title).$('..[class="cart_item"]').$('[data-test^="remove"]').click();

  await removeArrayInList(itemPosition, storeValues);
}

// ASSERTSIONS //
async function validateItemsInCart(storedValues) {
  console.log('help', storedValues.title);

  const nameResult = await browser
    .$(
      `//div[contains(text(), "${storedValues.title}")]//ancestor::div[@class="cart_item"]//div[@class="inventory_item_name"]`,
    )
    .getText();
  await expect(nameResult).toEqual(storedValues.title);

  const priceResult = await browser
    .$(
      `//div[contains(text(), "${storedValues.title}")]//ancestor::div[@class="cart_item"]//div[@class="inventory_item_price"]`,
    )
    .getText();
  await expect(priceResult).toEqual(storedValues.price);
}

export async function ValidateTotalCart(itemTotal: string) {
  const results = await browser.$$('[class="cart_item"]').length;
  await expect(results).toEqual(Number(itemTotal));
}

export async function ValidateItemInCart(itemValue: string) {
  console.log('pre-cry', itemValue);
  const storedValues = await searchArrayInList(itemValue, storeValues);
  console.log('cry', storedValues);
  await validateItemsInCart(storedValues);
}

export async function ValidatesAllInCart() {
  for (let i = 0; i < storeValues.length; i++) {
    await validateItemsInCart(storeValues[i]);
  }
}
