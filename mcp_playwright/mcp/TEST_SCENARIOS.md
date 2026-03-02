# Test Scenarios

This file contains the individual scenarios to be executed by the agent.
Refer to [TEST_SETUP.md](./TEST_SETUP.md) for global pre-requisites, teardown steps, permissions, and reporting guidelines.

## Scenario 1: Add 1st Item to Cart

**Goal**: Verify that a standard user can successfully login, add the first item to their cart, and validate it appears on the checkout page.

**Instructions for Agent**:

1.  **Navigate** to the application URL: `https://www.saucedemo.com/`
2.  **Login** with the following credentials:
    -   **Username**: `standard_user`
    -   **Password**: `secret_sauce`
3.  **Find** the first item in the inventory list.
4.  **Click** the "Add to cart" button for that first item.
5.  **Navigate** to the Shopping Cart (click the cart icon).
6.  **Logout** from the application.

## Scenario 2: Incorrect Login

**Goal**: Verify that user cannot login with incorrect credentials.

**Instructions for Agent**:

1.  **Navigate** to the application URL: `https://www.saucedemo.com/`
2.  **Login** with the following credentials:
    -   **Username**: `standard_user`
    -   **Password**: `banana`
3.  **Verify** user cannot login.
