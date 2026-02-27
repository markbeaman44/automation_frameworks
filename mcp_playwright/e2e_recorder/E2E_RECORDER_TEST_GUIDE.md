# E2E Recorder Workflow & Guidelines

This document outlines the workflow for recording user interactions and generating robust Playwright E2E tests using the AI Agent.

## 1. The Recording Process

1.  **Start Recording**: Run `npm run e2e_recorder` (or `npx tsx e2e_recorder/run_recorder.ts`).
2.  **Enter URL**: The script will prompt for the target URL.
3.  **Interact**: The browser launches. Perform the test actions (clicks, fills, navigations).
    -   *Tip*: Click slowly and deliberately.
    -   *Tip*: Use distinctive text or IDs where possible.
4.  **Finish**: Close the browser window to stop recording.
5.  **Output**: A JSON file is saved to `e2e_recorder/recordings/latest.json` (and timestamped archive).

## 2. Test Generation Rules (AI Agent)

When generating tests from `e2e_recorder/recordings/latest.json`, the AI Agent MUST follow these rules:

### A. Framework Consistency
-   **Detect Pattern**: Check `tests/` for existing patterns (Page Object Model vs. Inline).
    -   If POM exists, create/update Page Objects in `pages/` or `lib/` and consume them in the test.
    -   If Inline exists, follow the structure of existing `.spec.ts` files.
-   **Naming**: Use descriptive names for variables and test cases based on the actions (e.g., `test('User can login and view dashboard')`).

### B. Selector Strategy
-   **Priority**:
    1.  `data-testid` (e.g., `getByTestId('submit-btn')`)
    2.  Text content (e.g., `getByRole('button', { name: 'Submit' })`)
    3.  Placeholder (e.g., `getByPlaceholder('Enter email')`)
    4.  CSS Class (Use only if stable/unique)
    5.  **AVOID**: Long XPaths or absolute paths (e.g., `div > div > div:nth-child(3)`).

### C. Validation & Assertions
-   **Implicit**: Playwright actions await navigations automatically.
-   **Explicit**: Add assertions for key checkpoints.
    -   *Landing*: `await expect(page).toHaveURL(/dashboard/);`
    -   *Visibility*: `await expect(page.getByText('Welcome')).toBeVisible();`
    -   *Footer/Header*: Check for common elements to verify page load completeness (e.g., `await expect(page.locator('footer')).toBeVisible();`).

### D. Grouping
-   Group related tests in `describe` blocks.
-   If a recording covers multiple distinct flows (e.g., Login + Profile Update), split them into separate `test()` blocks if logical, or keep as one E2E flow.

## 3. Self-Healing Protocol

If a generated test fails:
1.  **Analyze**: The Agent reads the error log (Timeout vs. Assertion Error).
2.  **Inspect**: The Agent launches a browser to the failing URL to inspect the *current* DOM state.
3.  **Heal**:
    -   If selector changed: Update the selector in the code.
    -   If logic changed: Propose a new flow or ask user for clarification.
4.  **Verify**: Re-run *only* the failing test to confirm the fix.

## 4. Large Framework Handling
-   If the project grows large (>50 test files), the Agent should use the URL path to infer the directory structure (e.g., `url/login` -> `tests/auth/login.spec.ts`).
