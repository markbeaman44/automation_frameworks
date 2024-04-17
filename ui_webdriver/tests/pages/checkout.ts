import { storeValues } from '../support/constant.js';

async function searchArrayInList(nameKey: string, myArray: any) {
  return myArray.filter((i: any) =>  i.name === nameKey )[0]
}

// ASSERTSIONS //
async function validateItemsInCart(storedValues: any) {
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
  const storedValues = await searchArrayInList(itemValue, storeValues);
  await validateItemsInCart(storedValues);
}

export async function ValidatesAllInCart() {
  for (let i = 0; i < storeValues.length; i++) {
    await validateItemsInCart(storeValues[i]);
  }
}
