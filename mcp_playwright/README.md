## Installation
```
Install Node: https://nodejs.org/en/download/
```

## Project Setup
In terminal, navigate to project root folder, then type:
```
npm install
```

## Playwright MCP Server Setup

### Connecting in Antigravity

To connect to a custom MCP server in Antigravity:

1. Open the **MCP store** via the **"..."** dropdown at the top of the editor's agent panel.
2. Click on **"Manage MCP Servers"**.
3. Click on **"View raw config"**.
4. Modify the `mcp_config.json` with your custom MCP server configuration:
5. Replace `{{HOME_PATH_TO_REPO_INSERT_HERE}}` with the path to your local repository.
   - Go to playwright-mcp.config.json, right-click on the file, and select "Copy path".

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

### Browser Configuration Files
The following files are critical for consistent test execution:

1.  **`mcp/playwright-mcp.config.json`**: Controls browser launch options (headless, args).
2.  **`mcp/init-page.ts`**: Handles page state reset (cookies, permissions) and **viewport size**.
3.  **`mcp/init-script.js`**: Handles browser context scripts (e.g. eliminating bot detection).

Ensure your `mcp_config.json` points to these files correctly using the `--init-page` and `--init-script` arguments.

## Running the Manual Test Case

We have created a sample "Agent Task" that you can feed to your AI assistant to verify the setup.

1.  Add test scenario(s) to the file [TEST_SCENARIOS.md](./TEST_SCENARIOS.md).
2.  Go to AI/Agent chat in Antigravity.
3.  Say something like: 
    > "Using the Playwright MCP tools, please execute the test case described in TEST_SCENARIOS.md"
    
    > "Using the Playwright MCP tools, please execute the test case described in TEST_SCENARIOS.md - only Scenario 1"

The agent should then launch a browser (headless or visible depending on config), interact with the site, and report back the results.


## Run your end-to-end tests
```
npm run test:open
```
execute tests via GUI
```
npm run test:run
```
execute tests (run in background)
```
npm run test:report
```
view test results after npm run test:run

## Agent Mode & Self-Healing
This framework is optimized for AI-assisted development and "Self-Healing" automation.

### [AGENTS.md](./AGENTS.md)
Refer to the [AGENTS.md](./AGENTS.md) file for a detailed guide on how AI Agents should interact with this codebase. It provides a structured workflow for:
- **Test Detection**: Using `npm run test:run` to identify breakages.
- **Visual Debugging**: Using the Playwright MCP tools to manually inspect the live application state.
- **Self-Healing**: Identifying selector changes and automatically updating `.spec.ts` files to fix broken tests.

### Proactive Self-Healing (Agent Mode)
**IMPORTANT**: To enable proactive self-healing, you must ask the **Agent** to run the tests (e.g., "Run the tests" or "Execute npm run test:run"). 

If you run the tests in your **local terminal** directly, the agent cannot monitor the output and will not be able to proactively offer to fix failures.

If the Agent executes the tests and detects a failure, it will:
1.  **Inform you** that the tests are broken.
2.  **Prompt you**: *"Would you like me to initiate the self-healing workflow in `AGENTS.md`?"*
3.  **Act only on approval**: If you say **"Yes"**, the agent will debug and fix the selectors automatically. If you say **"No"**, it will stop.

## Lints and fixes files
```
npm run lint
```