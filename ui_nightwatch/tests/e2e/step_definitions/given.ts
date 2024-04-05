import { Given } from '@cucumber/cucumber';
import * as loginPage from '../../pages/login';

Given(/logs in using credentials "([^"]*)" and "([^"]*)"/, async (username: string, password: string) => {
  await loginPage.login(username, password);
});
