# MCP Playwright Framework

## Description
This framework leverages the Model Context Protocol (MCP) to enable AI agents to execute Playwright tests directly. It uses the `@playwright/mcp` server to control a browser instance, allowing for "manual" test execution by the AI agent based on written scenarios.

## Tech Stack
-   **Server**: `@playwright/mcp` (latest)
-   **Configuration**: JSON-based MCP config
-   **Execution**: AI Agent via Antigravity

## Project Structure
```
mcp_playwright/
├── .gitignore
├── package.json
├── package-lock.json
├── playwright-mcp.config.json  # Browser launch options
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
        "--config={{ABSOLUTE_PATH_TO_REPO}}/mcp_playwright/playwright-mcp.config.json"
      ],
      "disabled": false
    }
  }
}
```

### Browser Config (`playwright-mcp.config.json`)
This file controls how the browser is launched.

```json
{
    "browser": {
        "browserName": "chromium",
        "isolated": true,
        "launchOptions": {
            "headless": false,
            "args": [
                "--disable-features=PasswordLeakDetection,PasswordManager",
                "--disable-save-password-bubble",
                "--incognito"
            ]
        }
    }
}
```

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

## Reporting
-   Reports are generated in the `reports/` directory.
-   Format: Markdown (`test_report_YYYY-MM-DD_HH-MM.md`).
-   Template: Defined in `reports/TEMPLATE.md`.
-   **Failure Policy**: If a test fails, the browser recording (artifact) path must be included in the report.

## Key Principles
-   **Agent-Driven**: Unlike standard Playwright frameworks where code runs the tests, here the **Agent** runs the tests using MCP tools.
-   **Manual-style Scenarios**: Tests are written in plain English steps in `TEST_SCENARIOS.md`, mimicking manual test cases.
-   **Clean Teardown**: Strict rules ensure the browser is closed before report generation to prevent state leakage and ensure report accuracy.
