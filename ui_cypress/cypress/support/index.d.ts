/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     */
    login(username: string, password: string): Chainable<Element>;
    logout(): Chainable<Element>;
  }
}
