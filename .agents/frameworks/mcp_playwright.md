# MCP Playwright Framework

## Description
This framework leverages the Model Context Protocol (MCP) to enable AI agents to execute Playwright tests directly. It uses the `@playwright/mcp` server to control a browser instance, allowing for "manual" test execution by the AI agent based on written scenarios.

## Tech Stack
-   **Server**: `@playwright/mcp` (latest)
-   **Core**: `@playwright/test`
-   **Language**: TypeScript (for init scripts)
-   **Configuration**: JSON-based MCP config
-   **Execution**: AI Agent via Antigravity

## Project Structure
```
mcp_playwright/
├── .gitignore
├── package.json
├── package-lock.json
├── mcp/                        # MCP specific scripts
│   ├── playwright-mcp.config.json  # Browser launch options
│   ├── init-page.ts            # Page initialization (viewport, permissions)
│   └── init-script.js          # Browser context initialization (e.g. anti-fingerprinting)
├── README.md                   # Setup instructions
├── TEST_SCENARIOS.md           # Detailed test steps for each scenario
├── TEST_SETUP.md               # Global setup, teardown, and permissions
└── reports/                    # Generated test reports
    └── TEMPLATE.md             # Report template
```

## Installation & Setup

1.  **Navigate to directory**:
    ```bash
    cd mcp_playwright
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Configuration

### MCP Server Config (`~/.gemini/antigravity/mcp_config.json`)
To enable the Playwright MCP server in Antigravity, add the following to your global MCP config:

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "timeout": 30,
      "args": [
        "-y",
        "@playwright/mcp@latest",
        "--config",
        "{{HOME_PATH_TO_REPO_INSERT_HERE}}/mcp/playwright-mcp.config.json",
        "--init-page",
        "{{HOME_PATH_TO_REPO_INSERT_HERE}}/mcp/init-page.ts",
        "--init-script",
        "{{HOME_PATH_TO_REPO_INSERT_HERE}}/mcp/init-script.js"
      ],
      "disabled": false
    }
  }
}
```

### Browser Config
The following configuration files are essential for proper browser startup:

### Browser Configuration Files

The following configuration files are essential for proper browser startup and behavior normalization.

#### 1. `mcp/playwright-mcp.config.json`
Controls browser launch options, including the engine (Chromium/Firefox/WebKit) and startup arguments.

```json
{
    "browser": {
        "browserName": "chromium",
        "isolated": true,
        "launchOptions": {
            "headless": true,
            "args": [
                "--disable-features=PasswordLeakDetection,PasswordManager",
                "--disable-save-password-bubble",
                "--incognito"
            ]
        }
    }
}
```

#### 2. `mcp/init-page.ts`
Handles page initialization. **Agents MUST respect the viewport size defined here.** This script also handles permission clearing and popup suppression (e.g., neutralizing the `navigator.credentials` API).

```typescript
import type { Page } from 'playwright';

export default async ({ page }: { page: Page }) => {
    const context = page.context();

    // Hard guarantees
    await context.clearCookies();
    await context.clearPermissions();

    await page.setViewportSize({ width: 1280, height: 720 });

    // Explicitly control permissions
    await context.grantPermissions([], { origin: '*' });

    // Kill credential behaviour at the API level
    await context.addInitScript(() => {
        if ('credentials' in navigator) {
            // @ts-ignore
            navigator.credentials.get = async () => null;
            // @ts-ignore
            navigator.credentials.store = async () => { };
            // @ts-ignore
            navigator.credentials.preventSilentAccess = async () => { };
        }
    });
};
```

#### 3. `mcp/init-script.js`
Runs in the browser context before pages load. It stabilizes the environment (e.g., setting locales) and reduces automation fingerprints (`navigator.webdriver`).

```javascript
// Remove automation fingerprints
Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

// Stabilise environment
Object.defineProperty(navigator, 'languages', {
    get: () => ['en-GB', 'en']
});

Object.defineProperty(navigator, 'plugins', {
    get: () => [1, 2, 3]
});

// Optional: lock timezone / locale effects
Intl.DateTimeFormat = new Proxy(Intl.DateTimeFormat, {
    construct(target, args) {
        return new target('en-GB', args[1]);
    }
});
```

Ensure all three files are referenced in your `mcp_config.json` as shown above.

## Execution Workflow

The framework is designed for an AI agent to read instructions and execute them step-by-step.

1.  **`TEST_SETUP.md`**: The entry point for the agent. It defines:
    -   Global Pre-requisites (MCP server active)
    -   Agent Permissions (Auto-execution of browser tools)
    -   Teardown Instructions (Close browser, generate report)
    -   Reporting Guidelines

2.  **`TEST_SCENARIOS.md`**: Contains the specific, step-by-step instructions for each test case (e.g., "Add 1st Item to Cart").

### How to Run
Ask the AI agent:
> "Using the Playwright MCP tools, please execute the test case described in `mcp_playwright/TEST_SCENARIOS.md` - specifically Scenario 1."

### Proactive Failure Handling
When executing `npm run test:run` or any automated test suite:
1.  **Detect Failure**: If any tests fail, the Agent **MUST** inform the user immediately.
2.  **Prompt for Self-Healing**: The Agent **MUST** ask the user: *"The tests have failed. Would you like me to initiate the self-healing workflow described in `AGENTS.md` to identify and fix the issue?"*
3.  **Await Response**: 
    -   If the user says **"Yes"**, proceed with the Step-by-Step Self-Healing workflow in `AGENTS.md`. **MANDATORY**: For the final verification step, ONLY run the specific failing test file using `npx playwright test <path_to_file>`. Do not rerun the full suite.
    -   If the user says **"No"**, do nothing further.

## Reporting
-   Reports are generated in the `reports/` directory.
-   Format: Markdown (`test_report_YYYY-MM-DD_HH-MM.md`).
-   Template: Defined in `reports/TEMPLATE.md`.
-   **Failure Policy**: If a test fails, the browser recording (artifact) path must be included in the report.

## Scaling to Automated Testing
If the user expresses interest in building out a more comprehensive or permanent automation suite:
1.  **Prompt the User**: Ask if they would like to build a full Playwright automation suite (Page Object Model, Spec files).
2.  **Reference**: If yes, the Agent MUST reference [playwright_ts.md](./playwright_ts.md) for architectural guidelines and implementation patterns.

## Key Principles
-   **Agent-Driven**: Unlike standard Playwright frameworks where code runs the tests, here the **Agent** runs the tests using MCP tools.
-   **Manual-style Scenarios**: Tests are written in plain English steps in `TEST_SCENARIOS.md`, mimicking manual test cases.
-   **Clean Teardown**: Strict rules ensure the browser is closed before report generation to prevent state leakage and ensure report accuracy.
