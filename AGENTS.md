# Copilot Instructions

You are an expert automation testing engineer specializing in building test automation frameworks from scratch. You have deep knowledge of multiple testing tools and frameworks including Cypress, Playwright, WebDriver.io, Selenium, TestCafe, Nightwatch, Appium, Jest, Pytest, and Postman.

## Your Role

When users ask you to create or help with test automation frameworks, you should:

1. **Analyze the existing workspace structure** - This workspace contains multiple automation frameworks organized by type (API testing and UI testing) with different tools
2. **Use the established patterns** - Follow the coding patterns, file structures, and organizational approaches already present in this workspace
3. **Recommend latest stable versions** - Always suggest the latest pinned versions of packages, but warn about breaking changes if they cannot be resolved
4. **Maintain consistency** - Keep Page Object Model patterns consistent across all frameworks as shown in the existing code

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

## Framework-Specific Guidelines

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

### WebDriver.io + TypeScript + Cucumber
**Latest Versions (as of 2026):**
- @wdio/cli: ^8.x.x (or latest)
- @wdio/local-runner: ^8.x.x
- @wdio/cucumber-framework: ^8.x.x
- @wdio/spec-reporter: ^8.x.x
- typescript: ^5.x.x

**Breaking Changes to Note**:
- WebDriver.io 8+ has significant changes from v7
- `@cucumber/cucumber` version 10+ changes step definition imports

**Structure:**
```
ui_webdriver/
├── wdio.conf.ts
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
    │   ├── login.ts
    │   └── products.ts
    └── support/
        ├── helpers.ts
        └── constant.ts
```

**wdio.conf.ts:**
```typescript
export const config: Options.Testrunner = {
  runner: 'local',
  specs: ['./tests/e2e/**/*.feature'],
  maxInstances: 1,
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--headless', '--disable-gpu']
    }
  }],
  logLevel: 'info',
  baseUrl: 'https://www.saucedemo.com',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'cucumber',
  reporters: ['spec'],
  cucumberOpts: {
    require: ['./tests/e2e/step_definitions/**/*.ts'],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: false,
    tagExpression: '',
    timeout: 60000,
    ignoreUndefinedDefinitions: false
  }
};
```

**Page Object Example (tests/pages/login.ts):**
```typescript
enum id {
  username = '[data-test="username"]',
  password = '[data-test="password"]',
  loginButton = '[data-test="login-button"]',
}

export async function login(username: string, password: string) {
  await $(id.username).setValue(username);
  await $(id.password).setValue(password);
  await $(id.loginButton).click();
}

export async function navigateToLoginPage() {
  await browser.url('/');
}

export async function verifyLoginSuccess() {
  await expect(browser).toHaveUrl(expect.stringContaining('/inventory.html'));
}
```

**Hooks Example (tests/e2e/step_definitions/hooks.ts):**
```typescript
import { Before, After, Status } from '@cucumber/cucumber';

Before(async function () {
  await browser.maximizeWindow();
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await browser.takeScreenshot();
    this.attach(screenshot, 'image/png');
  }
});
```

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

### Nightwatch + TypeScript + Cucumber
**Latest Versions (as of 2026):**
- nightwatch: ^3.x.x (or latest)
- @cucumber/cucumber: ^10.x.x
- chromedriver: ^latest
- typescript: ^5.x.x

**Structure:**
```
ui_nightwatch/
├── nightwatch.conf.js
├── cucumber.js
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

**nightwatch.conf.js:**
```javascript
module.exports = {
  src_folders: ['tests'],
  page_objects_path: ['tests/pages'],
  
  webdriver: {
    start_process: true,
    server_path: require('chromedriver').path,
    port: 9515,
  },

  test_settings: {
    default: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['--headless']
        }
      }
    }
  }
};
```

**Page Object Example (tests/pages/login.ts):**
```typescript
import { NightwatchBrowser } from 'nightwatch';

enum id {
  username = '[data-test="username"]',
  password = '[data-test="password"]',
  loginButton = '[data-test="login-button"]',
}

export async function login(browser: NightwatchBrowser, username: string, password: string) {
  await browser
    .setValue(id.username, username)
    .setValue(id.password, password)
    .click(id.loginButton);
}

export async function navigateToLoginPage(browser: NightwatchBrowser) {
  await browser.url('https://www.saucedemo.com');
}
```

### Selenium + Python + Behave (BDD)
**Latest Versions (as of 2026):**
- selenium: ^4.x.x (or latest)
- behave: ^1.x.x
- python: ^3.10+

**Structure:**
```
ui_selenium/
├── behaverc
├── Dockerfile
├── docker-compose.yaml
├── Makefile
├── requirements.txt
├── README.md
└── features/
    ├── __init__.py
    ├── environment.py
    ├── feature_files/
    │   └── *.feature
    ├── steps/
    │   ├── given.py
    │   ├── when.py
    │   ├── then.py
    │   └── __init__.py
    ├── pages/
    │   ├── login.py
    │   └── __init__.py
    └── support/
        ├── constant.py
        ├── helpers.py
        └── __init__.py
```

**requirements.txt:**
```
selenium>=4.0.0
behave>=1.2.6
webdriver-manager>=4.0.0
```

**Page Object Example (features/pages/login.py):**
```python
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LoginSelectors:
    USERNAME = (By.CSS_SELECTOR, '[data-test="username"]')
    PASSWORD = (By.CSS_SELECTOR, '[data-test="password"]')
    LOGIN_BUTTON = (By.CSS_SELECTOR, '[data-test="login-button"]')
    ERROR_MESSAGE = (By.CSS_SELECTOR, '[data-test="error"]')

def login(context, username: str, password: str) -> None:
    driver = context.driver
    wait = WebDriverWait(driver, 10)
    
    username_input = wait.until(EC.presence_of_element_located(LoginSelectors.USERNAME))
    username_input.send_keys(username)
    
    password_input = driver.find_element(*LoginSelectors.PASSWORD)
    password_input.send_keys(password)
    
    login_button = driver.find_element(*LoginSelectors.LOGIN_BUTTON)
    login_button.click()

def navigate_to_login_page(context) -> None:
    context.driver.get('https://www.saucedemo.com')

def verify_error_message(context, expected_message: str) -> None:
    driver = context.driver
    wait = WebDriverWait(driver, 10)
    error_element = wait.until(EC.presence_of_element_located(LoginSelectors.ERROR_MESSAGE))
    assert expected_message in error_element.text
```

**environment.py:**
```python
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def before_all(context):
    context.base_url = 'https://www.saucedemo.com'

def before_scenario(context, scenario):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    service = Service(ChromeDriverManager().install())
    context.driver = webdriver.Chrome(service=service, options=options)
    context.driver.maximize_window()

def after_scenario(context, scenario):
    context.driver.quit()
```

**Makefile:**
```makefile
.PHONY: install test test-local clean

install:
	pip install -r requirements.txt

test:
	behave features/feature_files

test-local:
	behave features/feature_files --tags=@smoke

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
```

### Appium + WebDriver.io + TypeScript + Cucumber (Mobile)
**Latest Versions (as of 2026):**
- @wdio/cli: ^8.x.x (or latest)
- @wdio/cucumber-framework: ^8.x.x
- appium: ^2.x.x
- appium-uiautomator2-driver: ^3.x.x (for Android)
- typescript: ^5.x.x

**Breaking Changes to Note**:
- Appium 2.0 has major breaking changes from 1.x
- Appium 2.0 requires driver plugins to be installed separately
- Capabilities structure changed in Appium 2.0

**Structure:**
```
ui_appium_webdriver/
├── wdio.conf.ts
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc.cjs
├── README.md
├── apk/ (Android apps)
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

**wdio.conf.ts:**
```typescript
export const config: Options.Testrunner = {
  runner: 'local',
  specs: ['./tests/e2e/**/*.feature'],
  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'Android Emulator',
    'appium:platformVersion': '13.0',
    'appium:automationName': 'UiAutomator2',
    'appium:app': './apk/app.apk',
    'appium:autoGrantPermissions': true,
    'appium:noReset': false,
  }],
  logLevel: 'info',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['appium'],
  framework: 'cucumber',
  reporters: ['spec'],
  cucumberOpts: {
    require: ['./tests/e2e/step_definitions/**/*.ts'],
    timeout: 60000,
  }
};
```

**Page Object Example (tests/pages/login.ts):**
```typescript
export async function login(username: string, password: string) {
  const usernameInput = await $('~username-input'); // accessibility ID
  const passwordInput = await $('~password-input');
  const loginButton = await $('~login-button');
  
  await usernameInput.setValue(username);
  await passwordInput.setValue(password);
  await loginButton.click();
}

export async function verifyLoginSuccess() {
  const homeScreen = await $('~home-screen');
  await expect(homeScreen).toBeDisplayed();
}
```

### Jest + TypeScript (API Testing)
**Latest Versions (as of 2026):**
- jest: ^29.x.x (or latest)
- ts-jest: ^29.x.x
- @types/jest: ^29.x.x
- axios: ^1.x.x
- typescript: ^5.x.x

**Structure:**
```
api_jest/
├── jest.config.ts
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc.cjs
├── README.md
└── tests/
    ├── api/
    │   ├── *.test.ts
    │   ├── helpers.ts
    │   ├── constant.ts
    │   └── types/
    │       └── interface.ts
    └── fixtures/
        └── *.json
```

**jest.config.ts:**
```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  collectCoverageFrom: [
    'tests/**/*.ts',
    '!tests/**/*.d.ts',
    '!tests/**/types/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};

export default config;
```

**Type Definitions (tests/api/types/interface.ts):**
```typescript
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface ApiResponse<T> {
  data: T;
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
}

export interface CreateUserRequest {
  name: string;
  job: string;
}

export interface CreateUserResponse extends CreateUserRequest {
  id: string;
  createdAt: string;
}
```

**Helper Functions (tests/api/helpers.ts):**
```typescript
import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from './constant';

export async function getRequest<T>(endpoint: string): Promise<AxiosResponse<T>> {
  return await axios.get(`${BASE_URL}${endpoint}`);
}

export async function postRequest<T, R>(endpoint: string, data: T): Promise<AxiosResponse<R>> {
  return await axios.post(`${BASE_URL}${endpoint}`, data);
}

export async function putRequest<T, R>(endpoint: string, data: T): Promise<AxiosResponse<R>> {
  return await axios.put(`${BASE_URL}${endpoint}`, data);
}

export async function deleteRequest<T>(endpoint: string): Promise<AxiosResponse<T>> {
  return await axios.delete(`${BASE_URL}${endpoint}`);
}
```

**Test Example (tests/api/users.test.ts):**
```typescript
import { getRequest, postRequest } from './helpers';
import { User, ApiResponse, CreateUserRequest, CreateUserResponse } from './types/interface';

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('should return a list of users', async () => {
      const response = await getRequest<ApiResponse<User[]>>('/api/users?page=1');
      
      expect(response.status).toBe(200);
      expect(response.data.data).toBeInstanceOf(Array);
      expect(response.data.data.length).toBeGreaterThan(0);
      expect(response.data.page).toBe(1);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData: CreateUserRequest = {
        name: 'John Doe',
        job: 'Developer'
      };
      
      const response = await postRequest<CreateUserRequest, CreateUserResponse>('/api/users', userData);
      
      expect(response.status).toBe(201);
      expect(response.data.name).toBe(userData.name);
      expect(response.data.job).toBe(userData.job);
      expect(response.data.id).toBeDefined();
      expect(response.data.createdAt).toBeDefined();
    });
  });
});
```

### Pytest + Python (API Testing)
**Latest Versions (as of 2026):**
- pytest: ^8.x.x (or latest)
- requests: ^2.x.x
- python: ^3.10+

**Structure:**
```
api_pytest/
├── Dockerfile
├── docker-compose.yaml
├── Makefile
├── requirements.txt
├── README.md
└── tests/
    ├── __init__.py
    ├── api/
    │   ├── __init__.py
    │   ├── test_users.py
    │   ├── helpers.py
    │   ├── constant.py
    │   └── types/
    │       ├── __init__.py
    │       └── interface.py
    └── fixtures/
        └── *.json
```

**requirements.txt:**
```
pytest>=8.0.0
requests>=2.31.0
pytest-html>=4.0.0
```

**Type Definitions (tests/api/types/interface.py):**
```python
from typing import TypedDict, Optional, List

class User(TypedDict):
    id: int
    email: str
    first_name: str
    last_name: str
    avatar: str

class ApiResponse(TypedDict):
    data: List[User]
    page: Optional[int]
    per_page: Optional[int]
    total: Optional[int]
    total_pages: Optional[int]

class CreateUserRequest(TypedDict):
    name: str
    job: str

class CreateUserResponse(CreateUserRequest):
    id: str
    createdAt: str
```

**Helper Functions (tests/api/helpers.py):**
```python
import requests
from typing import Dict, Any
from .constant import BASE_URL

def get_request(endpoint: str, params: Dict[str, Any] = None) -> requests.Response:
    url = f"{BASE_URL}{endpoint}"
    response = requests.get(url, params=params)
    return response

def post_request(endpoint: str, data: Dict[str, Any]) -> requests.Response:
    url = f"{BASE_URL}{endpoint}"
    response = requests.post(url, json=data)
    return response

def put_request(endpoint: str, data: Dict[str, Any]) -> requests.Response:
    url = f"{BASE_URL}{endpoint}"
    response = requests.put(url, json=data)
    return response

def delete_request(endpoint: str) -> requests.Response:
    url = f"{BASE_URL}{endpoint}"
    response = requests.delete(url)
    return response
```

**Test Example (tests/api/test_users.py):**
```python
import pytest
from .helpers import get_request, post_request
from .types.interface import User, CreateUserRequest

class TestUsersAPI:
    
    def test_get_users_returns_list(self):
        response = get_request('/api/users', params={'page': 1})
        
        assert response.status_code == 200
        data = response.json()
        assert 'data' in data
        assert isinstance(data['data'], list)
        assert len(data['data']) > 0
        assert data['page'] == 1
    
    def test_create_user_successfully(self):
        user_data: CreateUserRequest = {
            'name': 'John Doe',
            'job': 'Developer'
        }
        
        response = post_request('/api/users', user_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data['name'] == user_data['name']
        assert data['job'] == user_data['job']
        assert 'id' in data
        assert 'createdAt' in data
```

**Makefile:**
```makefile
.PHONY: install test test-verbose clean

install:
	pip install -r requirements.txt

test:
	pytest tests/

test-verbose:
	pytest tests/ -v -s

test-report:
	pytest tests/ --html=reports/report.html --self-contained-html

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache
```

### Cypress (API Testing)
**Latest Versions (as of 2026):**
- cypress: ^13.x.x (or latest)
- typescript: ^5.x.x

**Structure:**
```
api_cypress/
├── cypress.config.js
├── package.json
├── .eslintrc.json
├── .prettierrc.cjs
├── README.md
└── cypress/
    ├── e2e/
    │   └── *.cy.js
    ├── fixtures/
    │   └── *.json
    └── support/
        ├── commands.js
        ├── helpers.js
        └── v1/
            └── users.js
```

**Custom Commands (cypress/support/v1/users.js):**
```javascript
import { BASE_URL } from '../helpers';

export function getUsers(page = 1) {
  return cy.request({
    method: 'GET',
    url: `${BASE_URL}/api/users`,
    qs: { page },
  });
}

export function createUser(userData) {
  return cy.request({
    method: 'POST',
    url: `${BASE_URL}/api/users`,
    body: userData,
  });
}

export function updateUser(userId, userData) {
  return cy.request({
    method: 'PUT',
    url: `${BASE_URL}/api/users/${userId}`,
    body: userData,
  });
}

export function deleteUser(userId) {
  return cy.request({
    method: 'DELETE',
    url: `${BASE_URL}/api/users/${userId}`,
  });
}
```

**Test Example (cypress/e2e/users.cy.js):**
```javascript
import { getUsers, createUser } from '../support/v1/users';

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('should return a list of users', () => {
      getUsers(1).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data).to.be.an('array');
        expect(response.body.data.length).to.be.greaterThan(0);
        expect(response.body.page).to.eq(1);
      });
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', () => {
      const userData = {
        name: 'John Doe',
        job: 'Developer',
      };

      createUser(userData).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.name).to.eq(userData.name);
        expect(response.body.job).to.eq(userData.job);
        expect(response.body.id).to.exist;
        expect(response.body.createdAt).to.exist;
      });
    });
  });
});
```

## Common Patterns

### Helper Functions
Store reusable calculation/utility functions in a `helpers` file:

**TypeScript Example:**
```typescript
export type ConversionOption = 'multiply' | 'divide';

export function convertMilesToKm(option: ConversionOption, value: number): number {
  if (option === 'multiply') {
    return value * 1.60934;
  }
  if (option === 'divide') {
    return value / 1.60934;
  }
  throw new Error('Invalid conversion option');
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateRandomEmail(): string {
  const timestamp = Date.now();
  return `user${timestamp}@example.com`;
}
```

**Python Example:**
```python
from typing import Literal
from datetime import datetime
import random
import string

ConversionOption = Literal['multiply', 'divide']

def convert_miles_to_km(option: ConversionOption, value: float) -> float:
    if option == 'multiply':
        return value * 1.60934
    if option == 'divide':
        return value / 1.60934
    raise ValueError('Invalid conversion option')

def format_date(date: datetime) -> str:
    return date.strftime('%Y-%m-%d')

def generate_random_email() -> str:
    timestamp = int(datetime.now().timestamp())
    return f"user{timestamp}@example.com"
```

### Constants File
Store base URLs, timeouts, and other constants:

**TypeScript Example (support/constant.ts):**
```typescript
export const BASE_URL = 'https://reqres.in';
export const DEFAULT_TIMEOUT = 10000;
export const MAX_RETRIES = 3;

export const USERS = {
  STANDARD: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  LOCKED: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
};

export const ENDPOINTS = {
  USERS: '/api/users',
  LOGIN: '/api/login',
  REGISTER: '/api/register',
};
```

**Python Example (support/constant.py):**
```python
BASE_URL = 'https://reqres.in'
DEFAULT_TIMEOUT = 10
MAX_RETRIES = 3

USERS = {
    'STANDARD': {
        'username': 'standard_user',
        'password': 'secret_sauce',
    },
    'LOCKED': {
        'username': 'locked_out_user',
        'password': 'secret_sauce',
    },
}

ENDPOINTS = {
    'USERS': '/api/users',
    'LOGIN': '/api/login',
    'REGISTER': '/api/register',
}
```

### Store Values Pattern
Use this pattern to share data between steps in Cucumber tests:

**TypeScript Example:**
```typescript
export interface ProductParams {
  name?: string;
  title?: string;
  price?: string;
  description?: string;
}

export const storeValues: ProductParams[] = [];

export function addProduct(product: ProductParams): void {
  storeValues.push(product);
}

export function getProduct(index: number): ProductParams {
  return storeValues[index];
}

export function clearProducts(): void {
  storeValues.length = 0;
}
```

**Python Example:**
```python
from typing import TypedDict, List, Optional

class ProductParams(TypedDict, total=False):
    name: str
    title: str
    price: str
    description: str

store_values: List[ProductParams] = []

def add_product(product: ProductParams) -> None:
    store_values.append(product)

def get_product(index: int) -> ProductParams:
    return store_values[index]

def clear_products() -> None:
    store_values.clear()
```

## TypeScript Configuration

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "types": ["node", "cypress", "jest"],
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

## README Template

Each framework should have a comprehensive README:

```markdown
# [Framework Name] - [Testing Type] Framework

## Description
Brief description of what this framework tests and the tools used.

## Tech Stack
- [Tool 1] - vX.X.X
- [Tool 2] - vX.X.X
- TypeScript - v5.X.X

## Prerequisites
- Node.js v18+ (or Python 3.10+)
- npm or yarn (or pip)
- [Any other requirements]

## Installation

### Install Dependencies
\`\`\`bash
npm install
# or
pip install -r requirements.txt
\`\`\`

## Project Structure
\`\`\`
framework_name/
├── tests/
│   ├── e2e/ - End-to-end test files
│   ├── pages/ - Page Object Model files
│   └── support/ - Helper functions and constants
├── config files
└── README.md
\`\`\`

## Running Tests

### Run All Tests
\`\`\`bash
npm test
\`\`\`

### Run Specific Test
\`\`\`bash
npm test -- --spec "path/to/test"
\`\`\`

### Run with Different Browser
\`\`\`bash
npm run test:chrome
npm run test:firefox
\`\`\`

### Run in Headed Mode
\`\`\`bash
npm run test:headed
\`\`\`

## Linting and Formatting

### Run Linter
\`\`\`bash
npm run lint
\`\`\`

### Format Code
\`\`\`bash
npm run format
\`\`\`

## VS Code Cucumber Autocomplete (for Cucumber projects)

Add this to your `.vscode/settings.json`:

\`\`\`json
{
  "cucumberautocomplete.steps": ["tests/e2e/step_definitions/*.ts"],
  "cucumberautocomplete.syncfeatures": "tests/e2e/*.feature",
  "cucumberautocomplete.strictGherkinCompletion": false,
  "cucumberautocomplete.smartSnippets": true,
  "cucumberautocomplete.stepsInvariants": true
}
\`\`\`

## CI/CD Integration

Example GitHub Actions workflow:

\`\`\`yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
\`\`\`

## Troubleshooting

Common issues and solutions...

## Contributing

Guidelines for contributing...
```

## VS Code Settings for Cucumber

Always include VS Code Cucumber autocomplete configuration in README:

```json
{
  "cucumberautocomplete.steps": ["tests/e2e/step_definitions/*.ts"],
  "cucumberautocomplete.syncfeatures": "tests/e2e/*.feature",
  "cucumberautocomplete.strictGherkinCompletion": false,
  "cucumberautocomplete.smartSnippets": true,
  "cucumberautocomplete.stepsInvariants": true
}
```

## Docker Support

For Python projects, include Docker support:

**Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["pytest", "tests/"]
```

**docker-compose.yaml:**
```yaml
version: '3.8'
services:
  test:
    build: .
    volumes:
      - .:/app
    env_file:
      - docker-compose.env
```

**Makefile:**
```makefile
.PHONY: build run test clean

build:
	docker-compose build

run:
	docker-compose up

test:
	docker-compose run test pytest tests/

clean:
	docker-compose down -v
```

## Git Ignore Template

Standard `.gitignore` for test frameworks:

```
# Dependencies
node_modules/
venv/
.env
*.env
!docker-compose.env

# Test Results
test-results/
reports/
screenshots/
videos/
coverage/
.pytest_cache/
__pycache__/
*.pyc

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*

# Build
dist/
build/
*.tsbuildinfo
```

## Key Principles

1. **Function-based Page Objects** - NOT classes (except Playwright)
2. **Separate Cucumber step files** - given.ts, when.ts, then.ts, hooks.ts
3. **Consistent folder structure** - tests/pages, tests/support, tests/e2e
4. **Type safety** - Always use TypeScript interfaces/types or Python type hints
5. **Latest versions** - Pin to specific latest versions, note breaking changes
6. **Complete examples** - Provide full working examples, not partial snippets
7. **Documentation** - Include comprehensive README files
8. **Enum for selectors** - Use enums for CSS selectors/accessibility IDs
9. **Async/await** - Always use async/await for asynchronous operations
10. **Error handling** - Include proper error handling and assertions

## Breaking Changes to Watch For

### Cypress
- **v9 → v10+**: Complete config restructure, `cypress.json` → `cypress.config.ts`
- **v12 → v13**: Updated component testing, new API changes
- **Cucumber**: `cypress-cucumber-preprocessor` → `@badeball/cypress-cucumber-preprocessor`

### WebDriver.io
- **v7 → v8**: New capabilities format, updated service configurations
- **v8**: Improved TypeScript support, async/await required everywhere

### Playwright
- **v1.30+**: New test fixture syntax
- **v1.40+**: Enhanced TypeScript support, new assertion library

### Cucumber
- **v9 → v10**: Breaking changes in step definition imports and hooks
- Import changes: `@cucumber/cucumber` instead of individual packages

### Appium
- **v1 → v2**: Major breaking changes
  - Drivers must be installed separately
  - Capabilities structure changed
  - New plugin architecture

### Jest
- **v28 → v29**: Default test environment changes, config updates

### Selenium Python
- **v3 → v4**: Major API changes, new service architecture

## When Creating New Frameworks

### Questions to Ask
1. **Workspace/folder name** - Where should this framework be created? (e.g., `ui_cypress_new`, `ui_custom_framework`, `project_name`)
2. **What type of testing?** (UI, API, Mobile)
3. **Programming language?** (TypeScript, JavaScript, Python)
4. **Which tool?** (Cypress, Playwright, WebDriver.io, Selenium, etc.)
5. **BDD/Cucumber required?**
6. **Target browsers/devices?**
7. **CI/CD platform?** (GitHub Actions, GitLab CI, Jenkins)
8. **Docker support needed?**
9. **Any specific features or customizations needed?**

### Setup Checklist
- [ ] Create folder structure
- [ ] Add package.json/requirements.txt with **latest pinned versions**
- [ ] Add configuration files (config.ts, tsconfig.json, etc.)
- [ ] Add .gitignore
- [ ] Add .eslintrc.json and .prettierrc.cjs (for JS/TS)
- [ ] Create example page objects (function-based!)
- [ ] Create example tests
- [ ] Add helper functions
- [ ] Add constants file
- [ ] Add type definitions
- [ ] Create comprehensive README
- [ ] Add VS Code settings for Cucumber (if applicable)
- [ ] Add Docker support (if requested)
- [ ] Warn about breaking changes

### Example Response Format

When asked "Create new e2e Cypress TypeScript Cucumber Page Object Model framework", provide:

1. **Full folder structure visualization**
2. **All configuration files** with complete code blocks
3. **Example page objects** following function-based pattern with enums
4. **Example feature file** with Gherkin scenarios
5. **Example step definitions** (given.ts, when.ts, then.ts, hooks.ts)
6. **Example helper functions**
7. **Type definitions**
8. **Constants file**
9. **README.md** with setup and run instructions
10. **Package.json** with latest pinned versions
11. **Notes about breaking changes** compared to existing examples

### Installation Command Template

Always provide clear installation and setup commands:

```bash
# Create project directory
mkdir ui_framework_name
cd ui_framework_name

# Initialize project
npm init -y

# Install dependencies (with exact versions)
npm install --save-dev cypress@13.6.3 typescript@5.3.3 @badeball/cypress-cucumber-preprocessor@20.0.3

# Initialize TypeScript
npx tsc --init

# Create folder structure
mkdir -p cypress/e2e/step_definitions
mkdir -p cypress/pages
mkdir -p cypress/support
mkdir -p cypress/fixtures

# Open Cypress
npx cypress open
```

## Advanced Patterns

### Custom Assertions
```typescript
// helpers.ts
export function assertTextContains(actual: string, expected: string): void {
  if (!actual.includes(expected)) {
    throw new Error(`Expected "${actual}" to contain "${expected}"`);
  }
}

export function assertArrayLength(actual: any[], expectedLength: number): void {
  if (actual.length !== expectedLength) {
    throw new Error(`Expected array length ${expectedLength}, but got ${actual.length}`);
  }
}
```

### Retry Logic
```typescript
// helpers.ts
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Environment Configuration
```typescript
// constant.ts
export const ENV = process.env.NODE_ENV || 'staging';

export const CONFIG = {
  staging: {
    baseUrl: 'https://staging.example.com',
    apiUrl: 'https://api.staging.example.com',
  },
  production: {
    baseUrl: 'https://example.com',
    apiUrl: 'https://api.example.com',
  },
};

export const { baseUrl, apiUrl } = CONFIG[ENV as keyof typeof CONFIG];
```

## Final Notes

- Always reference existing framework examples when explaining patterns
- Provide complete, runnable code - not snippets
- Emphasize the function-based Page Object pattern (except Playwright)
- Warn about version-specific breaking changes
- Include Docker support for Python projects
- Always include comprehensive README files
- Add VS Code Cucumber settings for BDD projects
- Use enums for selectors
- Include type safety (TypeScript interfaces or Python type hints)
- Organize Cucumber steps into separate files
- Follow established folder structure patterns

Remember: The goal is to enable users to copy this framework structure into new projects and have a fully functional test automation setup with minimal modifications.
