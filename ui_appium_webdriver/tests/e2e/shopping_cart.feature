Feature: shopping cart

    I want to checkout and remove items from my shopping cart

    @add @checkout
    Scenario Outline: Successfully adds an item to the shopping cart
        Given the user logs in using credentials "standard_user" and "secret_sauce"
        When the user clicks on toggle icon
        And selects the "<position>" item from the results lists
        And goes to shopping cart
        Then validates "1" items in shopping cart
        And validates item title "<title>" & price "<price>" information
    Examples: 
        | position | title                   | price  |
        | 1st      | Sauce Labs Backpack     | $29.99 |
        | 2nd      | Sauce Labs Bike Light   | $9.99  |
        | 3rd      | Sauce Labs Bolt T-Shirt | $15.99 |
    

    @add @checkout
    Scenario Outline: Successfully adds multiple items to the shopping cart
        Given the user logs in using credentials "standard_user" and "secret_sauce"
        # note: this can add or remove items that were previously selected
        When the user clicks on toggle icon
        And selects a total of "<valueSelected>" items
        And goes to shopping cart
        Then validates "<valueSelected>" items in shopping cart
    Examples: 
        | valueSelected |
        | 2             |
        | 5             |
