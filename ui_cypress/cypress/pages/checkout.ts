import { storeValues } from '../support/constant';

function searchArrayInList(nameKey: string, myArray: any) {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].name === nameKey) {
      return myArray[i];
    }
  }
}

function removeArrayInList(nameKey: string, myArray: any) {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i].name === nameKey) {
      return myArray.splice(i, 1);
    }
  }
}

export function removeItem(itemPosition: string) {
  const storedValues = searchArrayInList(itemPosition, storeValues);

  cy.contains(storedValues.title).within((info) => {
    cy.wrap(info).parents('[class="cart_item"]').find('[data-test^="remove"]').click();

    removeArrayInList(itemPosition, storeValues);
  });
}

// ASSERTSIONS //
function validateItemsInCart(storedValues) {
  cy.contains(storedValues.title)
    .parents('[class="cart_item"]')
    .within((info) => {
      cy.wrap(info)
        .find('[class="inventory_item_name"]')
        .then((results) => {
          expect(results).to.have.text(storedValues.title);
        });
      cy.wrap(info)
        .find('[class="inventory_item_price"]')
        .then((results) => {
          expect(results).to.have.text(storedValues.price);
        });
    });
}

export function ValidateTotalCart(itemTotal: string) {
  cy.get('[class="cart_item"]').then((results) => {
    expect(results).to.have.length(Number(itemTotal));
  });
}

export function ValidateItemInCart(itemValue: string) {
  const storedValues = searchArrayInList(itemValue, storeValues);
  validateItemsInCart(storedValues);
}

export function ValidatesAllInCart() {
  for (let i = 0; i < storeValues.length; i++) {
    validateItemsInCart(storeValues[i]);
  }
}
