import { Then } from 'cypress-cucumber-preprocessor/steps';
import * as checkout from '../../pages/checkout';

Then(/validates "([^"]*)" items in shopping cart/, (itemTotal: string) => {
  checkout.ValidateTotalCart(itemTotal);
});

Then(/validates "([^"]*)" item title & price information/, (itemValue: string) => {
  checkout.ValidateItemInCart(itemValue.replace(/[^0-9]/g, ''));
});

Then(/validates all items information in shopping cart/, () => {
  checkout.ValidatesAllInCart();
});
