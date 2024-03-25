import { Then } from '@wdio/cucumber-framework';
import * as checkout from '../../pages/checkout.js';

Then(/validates "([^"]*)" items in shopping cart/, async (itemTotal: string) => {
  await checkout.ValidateTotalCart(itemTotal.replace(/[^0-9]/g, ''));
});

Then(/validates "([^"]*)" item title & price information/, async (itemValue: string) => {
  await checkout.ValidateItemInCart(itemValue.replace(/[^0-9]/g, ''));
});

Then(/validates all items information in shopping cart/, () => {
  checkout.ValidatesAllInCart();
});
