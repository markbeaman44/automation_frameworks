### Cypress + TypeScript + Cucumber
**Latest Versions (as of 2026):**
- cypress: ^13.x.x (or latest)
- @badeball/cypress-cucumber-preprocessor: ^20.x.x (or latest)
- @bahmutov/cypress-esbuild-preprocessor: ^2.x.x
- typescript: ^5.x.x

**Breaking Changes to Note**: 
- Cypress 10+ has completely different config structure than Cypress 9
- `@badeball/cypress-cucumber-preprocessor` replaced the old `cypress-cucumber-preprocessor`
- Cypress 10+ removed support for `cypress.json`, now uses `cypress.config.ts`
- `@cucumber/cucumber` version 10+ has breaking changes in step definition syntax

**Structure:**
```
ui_cypress/
├── cypress.config.ts
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc.cjs
├── README.md
└── cypress/
    ├── e2e/
    │   ├── *.feature (Cucumber scenarios)
    │   └── step_definitions/
    │       ├── given.ts
    │       ├── when.ts
    │       ├── then.ts
    │       └── hooks.ts
    ├── pages/
    │   ├── login.ts
    │   └── products.ts
    └── support/
        ├── e2e.ts (custom commands)
        ├── e2e.d.ts (TypeScript declarations)
        ├── helpers.ts
        └── constant.ts
```

**cypress.config.ts:**
```typescript
import { defineConfig } from 'cypress';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.ts',
    baseUrl: 'https://www.saucedemo.com',
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      return config;
    },
  },
});
```

**package.json scripts:**
```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "test": "cypress run",
    "test:chrome": "cypress run --browser chrome",
    "test:firefox": "cypress run --browser firefox",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write ."
  }
}
```

**Page Object Example (cypress/pages/login.ts):**
```typescript
enum id {
  username = '[data-test="username"]',
  password = '[data-test="password"]',
  loginButton = '[data-test="login-button"]',
  errorMessage = '[data-test="error"]',
}

export async function login(username: string, password: string) {
  cy.get(id.username).type(username);
  cy.get(id.password).type(password);
  cy.get(id.loginButton).click();
}

export async function verifyLoginError(expectedMessage: string) {
  cy.get(id.errorMessage).should('contain', expectedMessage);
}

export async function navigateToLoginPage() {
  cy.visit('/');
}
```

**Custom Commands (cypress/support/e2e.ts):**
```typescript
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session([username, password], () => {
    cy.visit('/');
    cy.get('[data-test="username"]').type(username);
    cy.get('[data-test="password"]').type(password);
    cy.get('[data-test="login-button"]').click();
  });
});
```

**TypeScript Declarations (cypress/support/e2e.d.ts):**
```typescript
declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): Chainable<void>;
  }
}
```
