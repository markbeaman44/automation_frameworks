import { When } from '@cucumber/cucumber';
import * as home from '../../pages/home';

When(/selects the "([^"]*)" item from the results lists/, async (t, itemPosition: string) => {
  await home.selectItem(itemPosition.toString().replace(/[^0-9]/g, ''));
});

When(/selects a total of "([^"]*)" items/, async (t, itemRandomItems: string) => {
  await home.selectRandomItems(Number(itemRandomItems));
});

When(/goes to shopping cart/, async (t) => {
  await home.goToShoppingCart();
});
