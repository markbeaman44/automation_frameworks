# Agent Task: Execute Manual Test Case

This file describes a manual test case for an AI agent to execute using the Playwright MCP tools.

## Global Pre-requisites
- Read global mcp_config.json at ~/.gemini/antigravity/mcp_config.json
- Read playwright-mcp.config.json at project level
- Ensure the Playwright MCP server is active
- Browser tools (browser_click, browser_fill_form, etc.) are available

## Global Teardown
- **Restart MCP Server**: After all scenarios are completed (Pass or Fail), you MUST restart the Playwright MCP server to ensure a clean state for the next run.
  - Use the tool `restart_mcp_server` if available, or instruct the user to "Restart the Playwright MCP server".
  - If no tool exists, explicitly state in the final response: "Please restart the Playwright MCP server manually to prevent popup issues on the next run."

## Agent Permissions
- **Automatic Execution**: The user explicitly grants permission to:
  - Run **Browser Tools** (open browser, click, type, etc.) without asking for confirmation.
  - Create and overwrite **Report Files** in the `mcp/reports/` directory without asking for confirmation.
  - **JUST DO IT**. Do not stop to ask "Shall I proceed?".

## STRICT ADHERENCE GUIDELINES (DO NOT IGNORE)

1.  **Environment Config (CRITICAL)**:
    -   **Analyze `mcp/setup/init-page.ts`**: Check this file for viewport settings and permissions. You **MUST** apply the viewport size defined here (e.g. `1280x720`) using `browser_resize` or `setViewportSize` if the browser opens with a different size.
    -   **Analyze `mcp/setup/init-script.js`**: Read this file to understand the anti-bot measures (e.g. `navigator.webdriver` overrides).
    -   **Verification**: Before starting the scenario, **verify** the environment matches these files. For example, check if `navigator.webdriver` is `undefined`. If not, you may need to manually inject the script using `browser_evaluate`.

2.  **Popups**: If a popup appears, PAUSE and ask the user. Do not try to click around it unless you have a specific script to kill it.

3.  **Reporting**:
    -   **IF TEST PASSES**: The "Evidence" section of the report MUST be empty. Do NOT list screenshots there, even if you took them. Screenshots signify failure to this user.
    -   **IF TEST FAILS**: Only THEN list the screenshots in the report.

4.  **Browser Closing**: You MUST call `browser_close` at the end. If it fails or the window stays open, note it, but you MUST attempt it.

## Handling Interruptions
-   **Popups**: If an unsuppressed browser popup (e.g., Chrome Password Manager) appears and blocks interaction:
    1.  **Pause Execution**: Do not attempt to force interactions if they are failing due to the popup.
    2.  **Notify User**: Explicitly ask the user to clear the popup manually.
        -   Example: "A browser popup is blocking the test. Please click 'Never' or close the popup to continue."
    3.  **Wait for Confirmation**: Ask the user to confirm they have cleared the popup before resuming the test steps.

## Execution Instructions

1.  **Read Scenarios**: Open the file `mcp/TEST_SCENARIOS.md` to find the specific test steps for the requested scenario.
2.  **Execute Scenario**: Follow the instructions in the chosen scenario.
3.  **Perform Teardown**: Run the steps defined in the "Teardown (Run After Test Suite)" section below.

## Teardown (Run After Test Suite)

**CRITICAL**: These steps must be performed IMMEDIATELY after the last step of any scenario.

1.  **Force Close Browser**: You MUST use the `browser_close` tool to explicitly close the browser page/context. do NOT assume it closes automatically.
2.  **Generate Report** (See "Reporting" section below). -> **CRITICAL**: Do this AFTER closing the browser.

## Reporting

**TIMING**: This step must be performed **AFTER** the browser has been closed (Step "Quit the browser").

Please **generate a Markdown report** in the `mcp/reports/` folder.
-   **Filename**: `test_report_YYYY-MM-DD_HH-MM.md`
-   **Template**: Use the structure defined in `mcp/reports/TEMPLATE.md`.
-   **Content**: Fill in the execution steps, pass/fail status for each, and a final summary.

**Recording Policy**:
-   **IF TEST PASSES**: Do NOT include or link the browser recording in the report.
-   **IF TEST FAILS**: You MUST include the full path to the browser recording (artifact) in the "Evidence" section of the report so the user can see what went wrong.

**Expected Outcome**: The agent should complete the entire flow without errors and report success upon verifying the item in the cart.
