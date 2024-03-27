import { Before, After } from '@cucumber/cucumber';
import { t } from 'testcafe';
import { storeValues } from '../../support/constant';
import * as login from '../../pages/login';

Before(async () => {
  await t.navigateTo('https://www.saucedemo.com');
});

After(async () => {
  // Logout
  await login.logout();
  // To clear items in shopping cart
  await t.deleteCookies();
  // Clean store values - removes existing values
  await storeValues.splice(0, storeValues.length);
});
