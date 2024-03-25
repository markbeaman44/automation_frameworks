Feature: shopping cart

    I want to checkout and remove items from my shopping cart

    @add @checkout
    Scenario Outline: Successfully adds multiple items to the shopping cart
        Given the user logs in using credentials "standard_user" and "secret_sauce"
        # note: this can add or remove items that were previously selected
        When the user selects a total of "<valueSelected>" items
        And goes to shopping cart
        Then validates "<valueTotal>" items in shopping cart
        And validates all items information in shopping cart
    Examples: 
        | valueSelected | valueTotal |
        | 3             | 3          |
        | 5             | 2          |
