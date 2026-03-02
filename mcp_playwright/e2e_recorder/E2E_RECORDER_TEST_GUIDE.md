# E2E Recorder Workflow & Guidelines

This document outlines the workflow for recording user interactions and generating robust Playwright E2E tests using the AI Agent.

## 1. The Recording Process

1.  **Start Recording**: Run `npm run e2e_recorder` (or `npx tsx e2e_recorder/run_recorder.ts`).
2.  **Interact with Browser**:
    -   **Click/Type**: Standard interactions are recorded in real-time. Use distinctive, user-centric selectors when prompted.
    -   **Assertions**: Click the **ASSERT** button to enter crosshair mode. Select an element on the page, then choose an assertion type (`toHaveText`, `toBeVisible`, etc.) from the list.
    -   **Edit Inline**: Use the ✏️ icon on any sidebar card to update a selector manually or re-pick it with the ⊕ icon. You can also edit typed values and change assertion types.
    -   **Clean Up**: Duplicate (⿻) or Delete (🗑️) accidental actions instantly.
3.  **Verify via Replay**: Use the **PLAY** button to re-run your sequence and ensure the flow is stable.
4.  **Output**: All actions are saved to `e2e_recorder/recordings/latest.json`.

## 2. Test Generation Rules (AI Agent)

When generating tests from `e2e_recorder/recordings/latest.json`, the AI Agent MUST follow these rules:

### A. Framework Consistency & POM
-   **Analyze Structural Pattern**: Check `tests/e2e/` for existing `test.beforeEach` blocks and `tests/pages/` for existing Page Object Models.
-   **Setup & Navigation**: 
    - Always prefer `await page.goto('/')` for the initial landing page.
    - Move setup actions (navigation + login) into a `test.beforeEach` block.
-   **Page Object Model (POM)**:
    - If a Page Object exists (e.g., `LoginPage`, `HomePage`), call its methods (e.g., `await loginPage.login(user, password)`) instead of duplicating selectors.
    - **Assertions**: Create reusable validation functions in the Page Objects (e.g., `await homePage.validateCardInfo(name, color)`) rather than placing raw `expect()` statements directly in the spec file.
-   **Naming**: Use descriptive test case names based on the flow (e.g., `test('successfully logs in and verifies product styles')`).

### B. Selector Strategy
-   **Priority**:
    1.  `data-testid` (e.g., `getByTestId('submit-btn')`)
    2.  Text content (e.g., `getByRole('button', { name: 'Submit' })`)
    3.  Placeholder (e.g., `getByPlaceholder('Enter email')`)
    4.  CSS Class (Use only if stable/unique)
    5.  **AVOID**: Long XPaths or absolute paths (e.g., `div > div > div:nth-child(3)`).

### C. Validation & Assertions
-   **Explicit Assertions**: Convert `type: assert` actions into `expect()` calls.
    -   Check `assertion` type and use the `value` and optional `attributeName`.
    -   Example: `expect(locator).toHaveCSS('color', 'rgb(24, 88, 58)')`.
-   **Implicit Navigations**: Playwright actions handle navigations automatically, but ensure `expect(page).toHaveURL()` is added if a navigation action exists.
-   **Checkpoints**: Add assertions for key visibility markers to ensure page load completeness.

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
