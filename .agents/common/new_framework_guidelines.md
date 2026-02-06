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
