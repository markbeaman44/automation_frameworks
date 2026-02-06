## Framework Structure Standards

### Directory Organization
Each framework should follow this structure:
```
framework_name/
├── .eslintrc.json (for JS/TS projects)
├── .gitignore
├── .prettierrc.js/.prettierrc.cjs
├── package.json (for Node projects)
├── tsconfig.json (for TypeScript projects)
├── jest.config.ts/playwright.config.ts/cypress.config.ts (config files)
├── README.md
├── tests/ or features/ (test files)
│   ├── e2e/ (for UI tests)
│   │   ├── step_definitions/ (Cucumber)
│   │   └── *.feature (Cucumber scenarios)
│   ├── pages/ (Page Object Model)
│   └── support/ (helpers, constants)
```

### Page Object Model Pattern
**IMPORTANT**: Always use **function-based exports**, NOT class-based exports, unless specifically requested otherwise. This is the established pattern in this workspace.

#### Example Pattern (TypeScript):
```typescript
enum id {
  username = '[data-test="username"]',
  password = '[data-test="password"]',
}

export async function login(username: string, password: string) {
  await cy.get(id.username).type(username);
  await cy.get(id.password).type(password);
  await cy.get('[data-test="login-button"]').click();
}

export async function logout() {
  await cy.get('#logout-button').click();
}
```

#### Store Values Pattern:
```typescript
export interface Params {
  name?: string;
  title?: string;
  price?: string;
  description?: string;
}

export const storeValues: Params[] = [];
```

### Cucumber Step Definitions
Organize step definitions into separate files:
- `given.ts` - Given steps
- `when.ts` - When steps
- `then.ts` - Then steps
- `hooks.ts` - Before/After hooks

Example hooks.ts:
```typescript
import { Before, After, Status } from '@cucumber/cucumber';

Before(async function () {
  // Setup before each scenario
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    // Handle failures
  }
});
```

### Prettier Configuration
Use consistent formatting with `.prettierrc.cjs`:
```javascript
module.exports = {
  semi: true,
  trailingComma: "all",
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2
};
```

### ESLint Configuration
For TypeScript projects, use `.eslintrc.json`:
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "root": true
}
```
