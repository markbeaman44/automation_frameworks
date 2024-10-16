import { When } from '@wdio/cucumber-framework';
import * as home from '../../pages/home.js';

When(/clicks on toggle icon/, async () => {
  await home.clickToggle();
});

When(/selects the "([^"]*)" item from the results lists/, async (itemPosition: string) => {
  await home.selectItem(itemPosition.replace(/[^0-9]/g, ''));
});

When(/selects a total of "([^"]*)" items/, async (itemRandomItems: string) => {
  await home.selectRandomItems(Number(itemRandomItems));
});

When(/goes to shopping cart/, async () => {
  await home.goToShoppingCart();
});
