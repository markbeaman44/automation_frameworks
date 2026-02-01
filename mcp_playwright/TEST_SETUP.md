# Agent Task: Execute Manual Test Case

This file describes a manual test case for an AI agent to execute using the Playwright MCP tools.

## Global Pre-requisites
- Read global mcp_config.json at ~/.gemini/antigravity/mcp_config.json
- Ensure the Playwright MCP server is active
- Browser tools (browser_click, browser_fill_form, etc.) are available

## Global Teardown
- **Restart MCP Server**: After all scenarios are completed (Pass or Fail), you MUST restart the Playwright MCP server to ensure a clean state for the next run.
  - Use the tool `restart_mcp_server` if available, or instruct the user to "Restart the Playwright MCP server".
  - If no tool exists, explicitly state in the final response: "Please restart the Playwright MCP server manually to prevent popup issues on the next run."

## Agent Permissions
- **Automatic Execution**: The user explicitly grants permission to:
  - Run **Browser Tools** (open browser, click, type, etc.) without asking for confirmation.
  - Create and overwrite **Report Files** in the `reports/` directory without asking for confirmation.
  - **JUST DO IT**. Do not stop to ask "Shall I proceed?".

## Execution Instructions

1.  **Read Scenarios**: Open the file `TEST_SCENARIOS.md` to find the specific test steps for the requested scenario.
2.  **Execute Scenario**: Follow the instructions in the chosen scenario.
3.  **Perform Teardown**: Run the steps defined in the "Teardown (Run After Test Suite)" section below.

## Teardown (Run After Test Suite)

**CRITICAL**: These steps must be performed IMMEDIATELY after the last step of any scenario.

1.  **Quit** the browser.
2.  **Generate Report** (See "Reporting" section below). -> **CRITICAL**: Do this AFTER closing the browser.

## Reporting

**TIMING**: This step must be performed **AFTER** the browser has been closed (Step "Quit the browser").

Please **generate a Markdown report** in the `reports/` folder.
-   **Filename**: `test_report_YYYY-MM-DD_HH-MM.md`
-   **Template**: Use the structure defined in `reports/TEMPLATE.md`.
-   **Content**: Fill in the execution steps, pass/fail status for each, and a final summary.

**Recording Policy**:
-   **IF TEST PASSES**: Do NOT include or link the browser recording in the report.
-   **IF TEST FAILS**: You MUST include the full path to the browser recording (artifact) in the "Evidence" section of the report so the user can see what went wrong.

**Expected Outcome**: The agent should complete the entire flow without errors and report success upon verifying the item in the cart.
