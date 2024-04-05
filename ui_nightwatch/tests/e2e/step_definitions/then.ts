import { Then } from '@cucumber/cucumber';
import * as checkout from '../../pages/checkout';

Then(/validates "([^"]*)" items in shopping cart/, async (itemTotal: string) => {
  await checkout.ValidateTotalCart(itemTotal.toString().replace(/[^0-9]/g, ''));
});

Then(/validates "([^"]*)" item title & price information/, async (itemValue: string) => {
  await checkout.ValidateItemInCart(itemValue.toString().replace(/[^0-9]/g, ''));
});

Then(/validates all items information in shopping cart/, async () => {
  await checkout.ValidatesAllInCart();
});
