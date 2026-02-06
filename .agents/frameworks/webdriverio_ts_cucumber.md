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
