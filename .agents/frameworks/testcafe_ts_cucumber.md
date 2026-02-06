### TestCafe + TypeScript + Cucumber
**Latest Versions (as of 2026):**
- testcafe: ^3.x.x (or latest)
- @cucumber/cucumber: ^10.x.x (or latest)
- typescript: ^5.x.x

**Structure:**
```
ui_testcafe/
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc.cjs
├── README.md
└── tests/
    ├── e2e/
    │   ├── *.feature
    │   └── step_definitions/
    │       ├── given.ts
    │       ├── when.ts
    │       ├── then.ts
    │       └── hooks.ts
    ├── pages/
    │   └── login.ts
    └── support/
        ├── helpers.ts
        └── constant.ts
```

**Page Object Example (tests/pages/login.ts):**
```typescript
import { Selector, t } from 'testcafe';

enum id {
  username = '[data-test="username"]',
  password = '[data-test="password"]',
  loginButton = '[data-test="login-button"]',
}

export async function login(username: string, password: string) {
  await t
    .typeText(Selector(id.username), username)
    .typeText(Selector(id.password), password)
    .click(Selector(id.loginButton));
}

export async function navigateToLoginPage() {
  await t.navigateTo('https://www.saucedemo.com');
}
```
