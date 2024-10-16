import { Given } from '@wdio/cucumber-framework';
import * as loginPage from '../../pages/login.js';

Given(/logs in using credentials "([^"]*)" and "([^"]*)"/, async (username: string, password: string) => {
  await loginPage.login(username, password);
});
