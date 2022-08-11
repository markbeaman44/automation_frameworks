import { Given } from '@badeball/cypress-cucumber-preprocessor';

Given(/logs in using credentials "([^"]*)" and "([^"]*)"/, (username: string, password: string) => {
  cy.login(username, password);
});
