# Agent Task: Shopping Cart Verification

This file describes a manual test case for an AI agent to execute using the Playwright MCP tools.

## Scenario: Add 1st Item to Cart

**Goal**: Verify that a standard user can successfully login, add the first item to their cart, and validate it appears on the checkout page.

**Pre-requisites**:
- Ensure the Playwright MCP server is active.
- Browser tools (browser_click, browser_fill_form, etc.) are available.


**Instructions for Agent**:

1.  **Navigate** to the application URL: `https://www.saucedemo.com/`
2.  **Login** with the following credentials:
    -   **Username**: `standard_user`
    -   **Password**: `secret_sauce`
3.  **Find** the first item in the inventory list.
4.  **Click** the "Add to cart" button for that first item.
5.  **Navigate** to the Shopping Cart (click the cart icon).
6.  **Verify** the following:
    -   There is exactly '1' item in the shopping cart badge or list.
    -   The item name matches the one you added.
7.  **Logout** from the application.
8.  **Quit** the browser.


## Scenario: Incorrect Login

**Goal**: Verify that user cannot login with incorrect credentials.

**Pre-requisites**:
- Ensure the Playwright MCP server is active.
- Browser tools (browser_click, browser_fill_form, etc.) are available.

**Instructions for Agent**:

1.  **Navigate** to the application URL: `https://www.saucedemo.com/`
2.  **Login** with the following credentials:
    -   **Username**: `standard_user`
    -   **Password**: `banana`
3.  **Verify** user cannot login.
4.  **Quit** the browser.

---

## Reporting

After completing the execution, please **generate a Markdown report** in the `reports/` folder.
-   **Filename**: `test_report_YYYY-MM-DD_HH-MM.md`
-   **Template**: Use the structure defined in `reports/TEMPLATE.md`.
-   **Content**: Fill in the execution steps, pass/fail status for each, and a final summary.

**Recording Policy**:
-   **IF TEST PASSES**: Do NOT include or link the browser recording in the report.
-   **IF TEST FAILS**: You MUST include the full path to the browser recording (artifact) in the "Evidence" section of the report so the user can see what went wrong.

**Expected Outcome**: The agent should complete the entire flow without errors and report success upon verifying the item in the cart.
