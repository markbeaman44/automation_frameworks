import { Before, After } from '@cucumber/cucumber';
import { storeValues } from '../../support/constant';
import * as login from '../../pages/login';

Before(async () => {
  await browser.navigateTo('/');
});

After(async () => {
  // Logout
  await login.logout();
  // To clear items in shopping cart
  await browser.cookies.delete('');
  // Clean store values - removes existing values
  await storeValues.splice(0, storeValues.length);
});
