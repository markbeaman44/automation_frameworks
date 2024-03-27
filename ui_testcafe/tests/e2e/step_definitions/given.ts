import { Given } from '@cucumber/cucumber';
import * as loginPage from '../../pages/login';

Given(/logs in using credentials "([^"]*)" and "([^"]*)"/, async (t, [username, password]) => {
  await loginPage.login(username, password);
});
