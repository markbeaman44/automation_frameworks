Feature: shopping cart

    I want to checkout and remove items from my shopping cart

    @add @checkout
    Scenario Outline: Successfully adds an item to the shopping cart
        Given the user logs in using credentials "standard_user" and "secret_sauce"
        When the user selects the "<position>" item from the results lists
        And goes to shopping cart
        Then validates "<position>" items in shopping cart
        And validates "<position>" item title & price information
    Examples: 
        | position |
        | 1st      |
        | 2nd      |
        | 3rd      |
