import { expect } from 'nightwatch';

import { storeValues } from '../support/constant';

async function searchArrayInList(nameKey: string, myArray: any) {
  return myArray.filter((i: any) =>  i.name === nameKey )[0]
}

// ASSERTSIONS //
async function validateItemsInCart(storedValues: any) {
  const nameResult = await browser.element
    .find({
      selector: `//div[contains(text(), "${storedValues.title}")]//ancestor::div[@class="cart_item"]//div[@class="inventory_item_name"]`,
      locateStrategy: 'xpath',
    })
    .getText();
  await expect(nameResult).contains(storedValues.title);

  const priceResult = await browser.element
    .find({
      selector: `//div[contains(text(), "${storedValues.title}")]//ancestor::div[@class="cart_item"]//div[@class="inventory_item_price"]`,
      locateStrategy: 'xpath',
    })
    .getText();
  await expect(priceResult).contains(storedValues.price);
}

export async function ValidateTotalCart(itemTotal: string) {
  const results = browser.element.findAll('[class="cart_item"]').count();
  await expect(results).eql(Number(itemTotal));
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
