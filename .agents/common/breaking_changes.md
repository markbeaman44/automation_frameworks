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
