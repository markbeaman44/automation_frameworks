# AI Agent Capabilities & Workflows

This document outlines how AI Agents can utilize the Playwright MCP integration to interact with, debug, and maintain this automation framework.

## Core Capabilities

1.  **Test Execution**: Run standard test scripts via `npm` commands.
2.  **Visual Debugging**: Use MCP tools (`browser_navigate`, `browser_click`, etc.) to manually inspect the application state when tests fail.
3.  **Code Repair (Self-Healing)**: Identify selector changes or logic errors through inspection and automatically update the `.spec.ts` files.

---

## Workflow: Self-Healing / Test Repair

**Goal**: Fix a broken Playwright test script (`.spec.ts`) that is failing due to UI changes.

### Step 1: Detect Failure
The Agent runs the test suite to identify the failing test and error message.
-   **Execution**: The Agent **MUST** be the one to execute `npm run test:run` in its own terminal to detect failures proactively.
-   **Notification**: If failures occur, the Agent **MUST** inform the user.
-   **Prompt**: The Agent **MUST** ask: *"Tests failed. Would you like me to use the self-healing workflow to fix the broken selectors?"*
-   **Approval**: Proceed only if the user says **"Yes"**.

### Step 2: Replicate State (The "Eyes")
The Agent uses **MCP Tools** to manually navigate to the page and inspect the element causing the failure. This effectively "sees" what the automation script cannot.
-   **CRITICAL**: Before interacting with the browser, **READ `TEST_SETUP.md`** to ensure your environment (viewport, permissions, etc.) matches the test expectations.
-   **Action**: Use `browser_navigate` to go to the URL.
-   **Action**: Use `browser_click` / `browser_fill_form` to reach the specific state where the failure occurred.
-   **Action**: Use `browser_snapshot` or `browser_take_screenshot` to inspect the current DOM and find the *new* correct selector (e.g., `#new-submit-btn`).

### Step 3: Apply Fix (The "Hands")
The Agent updates the source code with the correct selector found in Step 2.
-   **Action**: Read the failing file: `view_file tests/example.spec.ts`.
-   **Action**: Locate the outdated code: `await page.click('#submit-btn')`.
-   **Action**: Replace it with the new selector: `replace_file_content` -> `await page.click('#new-submit-btn')`.

### Step 4: Verify Fix
The Agent re-runs **ONLY** the specific test file that failed to ensure the fix works.
-   **CRITICAL**: Do NOT run the full suite (`npm run test:run`). You must be surgical to verify the fix quickly and avoid unrelated failures.
-   **Command**: `npx playwright test tests/path_to_failing_test.spec.ts`
-   **Success Criteria**: The test passes (exit code 0).

---

## Agent Guidelines

-   **Do NOT** try to "watch" the `npm run test:run` execution in real-time. You cannot see its browser.
-   **DO** use your own MCP browser instance to debug the *application*, then update the *code*.
-   **Report**: Always summarize the fix: "Detected selector #old changed to #new. Updated spec file. Test now passes."
