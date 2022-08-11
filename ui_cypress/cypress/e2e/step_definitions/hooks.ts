import { storeValues } from '../../support/constant';

before(() => {
  cy.visit('/');
});

afterEach(() => {
  // Logout
  cy.logout();
  // To clear items in shopping cart
  cy.clearCookies();
  // Clean store values - removes existing values
  storeValues.splice(0, storeValues.length);
});
