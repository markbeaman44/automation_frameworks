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
