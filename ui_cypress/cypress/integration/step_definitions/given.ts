import { Given } from 'cypress-cucumber-preprocessor/steps';

Given(/logs in using credentials "([^"]*)" and "([^"]*)"/, (username: string, password: string) => {
  cy.login(username, password);
});
