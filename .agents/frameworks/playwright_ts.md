### Playwright + TypeScript
**Latest Versions (as of 2026):**
- @playwright/test: ^1.x.x (or latest)
- typescript: ^5.x.x

**Breaking Changes to Note**:
- Playwright 1.30+ has new test fixture syntax
- Playwright 1.40+ has improved TypeScript support

**Structure:**
```
ui_playwright/
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc.cjs
├── README.md
└── tests/
    ├── e2e/
    │   └── *.spec.ts
    ├── pages/
    │   ├── LoginPage.ts
    │   └── ProductsPage.ts
    └── support/
        ├── helpers.ts
        └── constant.ts
```

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

**Page Object Example (tests/pages/LoginPage.ts):**
**NOTE**: Playwright is the **EXCEPTION** - use class-based Page Objects for Playwright only.

```typescript
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyErrorMessage(expectedMessage: string) {
    await expect(this.errorMessage).toContainText(expectedMessage);
  }
}
```

**Test Example (tests/e2e/login.spec.ts):**
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async () => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.login('invalid_user', 'wrong_password');
    await loginPage.verifyErrorMessage('Username and password do not match');
  });
});
```
