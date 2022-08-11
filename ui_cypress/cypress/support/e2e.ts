Cypress.Commands.add('login', (username: string, password: string) => {
  cy.get('[data-test="username"]').clear().type(username);
  cy.get('[data-test="password"]').clear().type(password);
  cy.get('[data-test="login-button"]').click();
});

Cypress.Commands.add('logout', () => {
  cy.get('[id="react-burger-menu-btn"]').click();
  cy.get('[id="logout_sidebar_link"]').click();
});
