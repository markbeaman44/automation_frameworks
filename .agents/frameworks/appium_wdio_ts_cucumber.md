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
