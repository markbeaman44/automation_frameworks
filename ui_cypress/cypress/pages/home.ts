import { storeValues } from '../support/constant';

function cssItemSelector(itemPosition: string) {
  return `[class="inventory_list"] > [class="inventory_item"]:nth-of-type(${itemPosition})`;
}

function storeSelectedValues(itemPosition: string) {
  let value: string;
  cy.get(`${cssItemSelector(itemPosition)}`).within((info) => {
    cy.wrap(info)
      .find('[class="inventory_item_name"]')
      .invoke('text')
      .then((nameValue) => {
        value = nameValue;
      });
    cy.wrap(info)
      .find('[class="inventory_item_price"]')
      .invoke('text')
      .then((priceValue) => {
        storeValues.push({ name: itemPosition, title: value, price: priceValue });
      });
  });
}

export function selectItem(itemPosition: string) {
  // Add value from storeValues
  storeSelectedValues(itemPosition);

  cy.get(`${cssItemSelector(itemPosition)} button`).click();
}

export function goToShoppingCart() {
  cy.get('[id="shopping_cart_container"]').click();
}

export function selectRandomItems(itemRandomItems: number) {
  for (let i = 1; i <= itemRandomItems; i++) {
    selectItem(i.toString());
  }
}
