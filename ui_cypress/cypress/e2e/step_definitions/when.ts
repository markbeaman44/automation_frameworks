import { When } from '@badeball/cypress-cucumber-preprocessor';
import * as home from '../../pages/home';
import * as checkout from '../../pages/checkout';

When(/selects the "([^"]*)" item from the results lists/, (itemPosition: string) => {
  home.selectItem(itemPosition.replace(/[^0-9]/g, ''));
});

When(/selects a total of "([^"]*)" items/, (itemRandomItems: string) => {
  home.selectRandomItems(Number(itemRandomItems));
});

When(/goes to shopping cart/, () => {
  home.goToShoppingCart();
});

When(/removes "([^"]*)" item from the shopping cart/, (itemPosition: string) => {
  checkout.removeItem(itemPosition.replace(/[^0-9]/g, ''));
});
