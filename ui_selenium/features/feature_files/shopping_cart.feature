Feature: shopping cart

    I want to checkout and remove items from my shopping cart

    @add @checkout @TEST
    Scenario Outline: Successfully adds an item to the shopping cart
        Given the user logs in using credentials "standard_user" and "secret_sauce"
        When the user selects the "<position>" item from the results lists
        And goes to shopping cart
        Then validates "1" items in shopping cart
        And validates "<position>" item title & price information
    Examples: 
        | position |
        | 1        |
        | 2        |
        | 3        |


    @add @checkout
    Scenario Outline: Successfully adds multiple items to the shopping cart
        Given the user logs in using credentials "standard_user" and "secret_sauce"
        # note: this can add or remove items that were previously selected
        When the user selects a total of "<valueSelected>" items
        And goes to shopping cart
        Then validates "<valueSelected>" items in shopping cart
        And validates all items information in shopping cart
    Examples: 
        | valueSelected |
        | 3             |
        | 5             |
