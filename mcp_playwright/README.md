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
        "{{HOME_PATH_TO_REPO_INSERT_HERE}}/mcp/setup/playwright-mcp.config.json",
        "--init-page",
        "{{HOME_PATH_TO_REPO_INSERT_HERE}}/mcp/setup/init-page.ts",
        "--init-script",
        "{{HOME_PATH_TO_REPO_INSERT_HERE}}/mcp/setup/init-script.js"
      ],
      "disabled": false
    }
  }
}
```

### Browser Configuration Files
The following files are critical for consistent test execution:

1.  **`mcp/setup/playwright-mcp.config.json`**: Controls browser launch options (headless, args).
2.  **`mcp/setup/init-page.ts`**: Handles page state reset (cookies, permissions) and **viewport size**.
3.  **`mcp/setup/init-script.js`**: Handles browser context scripts (e.g. eliminating bot detection).

Ensure your `mcp_config.json` points to these files correctly using the `--init-page` and `--init-script` arguments.

## Running the Manual Test Case

We have created a sample "Agent Task" that you can feed to your AI assistant to verify the setup.

1.  Run `yarn mcp:setup:manual` to create the agent workflow file locally.
2.  Add test scenario(s) to the file [mcp/TEST_SCENARIOS.md](./mcp/TEST_SCENARIOS.md).
3.  Go to AI/Agent chat in Antigravity.
4.  Use the shortcut: 
    > `@[/manual_test]` 
    
    > `@[/manual_test] 1` (to execute only Scenario 1)
5.  backup: 
    > "Using the Playwright MCP tools, please execute the test case described in mcp/TEST_SCENARIOS.md"
    
    > "Using the Playwright MCP tools, please execute the test case described in mcp/TEST_SCENARIOS.md - only Scenario 1"

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

## Recording Tests (E2E Recorder)
The framework includes a powerful **Interactive E2E Recorder** with a floating UI to build tests visually.

```bash
npm run record

# Or to start directly at a specific URL:
npm run record --url saucedemo.com
```

### Recorder Features:
1.  **Live Action List**: Watch your clicks, inputs, and navigations appear in the sidebar in real-time.
2.  **Interactive Assertions**: Click the **ASSERT** button to enter "Crosshair Mode". Click any element to add assertions like `toBeVisible`, `toHaveText`, or `toHaveCSS`.
3.  **Selective Replay**: Use the **PLAY** button to re-run your entire sequence from the start to verify the flow.
4.  **Inline Editing**: Click the ✏️ icon on any card to update its properties:
    -   **Inputs**: Split fields for the element selector and the typed value.
    -   **Assertions**: Change assertion types (e.g., `toHaveText` to `toBeVisible`) via a dropdown. Complex assertions (`toHaveCSS`) show extra fields for property names.
    -   **Re-picking**: Click the ⊕ icon inside an edit field to visually re-select any element on the page.
5.  **Management**: Duplicate (⿻) or Delete (🗑️) actions instantly.
6.  **Persistence**: The session is saved to `e2e_recorder/recordings/latest.json`. If you exit and restart, you can resume your previous session.

### Generating the Test:
Once you have recorded your flow, ask the **AI Agent**:
> "Generate a Playwright test from my latest recording."

The Agent follows these structural rules:
1.  **POM FIRST**: Maps actions (like login) to existing Page Object methods instead of using raw selectors.
2.  **Structural Integrity**: Moves navigation and login to `test.beforeEach` and uses relative URLs (`/`).
3.  **Encapsulated Assertions**: Creates validation functions within Page Objects (e.g. `validateCardInfo`) rather than adding raw `expect()` assertions directly to the spec.

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