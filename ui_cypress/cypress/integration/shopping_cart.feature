Feature: shopping cart

    I want to checkout and remove items from my shopping cart

    @add @checkout
    Scenario Outline: Successfully adds an item to the shopping cart
        Given the user logs in using credentials "standard_user" and "secret_sauce"
        When the user selects the "<position>" item from the results lists
        And goes to shopping cart
        Then validates "1" items in shopping cart
        And validates "<position>" item title & price information
    Examples: 
        | position |
        | 1st      |
        | 2nd      |
        | 3rd      |
        | 4th      |


    @add @checkout
    Scenario Outline: Successfully adds multiple items to the shopping cart
        Given the user logs in using credentials "standard_user" and "secret_sauce"
        When the user selects a total of "<valueTotal>" items
        And goes to shopping cart
        Then validates "<valueTotal>" items in shopping cart
        And validates all items information in shopping cart
    Examples: 
        | valueTotal |
        | 3          |
        | 5          |

    
    @remove @checkout
    Scenario Outline: Successfully remove an item from the shopping cart
        Given the user logs in using credentials "standard_user" and "secret_sauce"
        When the user selects a total of "<oldValueTotal>" items
        And goes to shopping cart
        And removes "<removeItem>" item from the shopping cart
        Then validates "<newValueTotal>" items in shopping cart
        And validates all items information in shopping cart
    Examples: 
        | oldValueTotal | removeItem | newValueTotal |
        | 2             | 1st        | 1             |
        | 3             | 2nd        | 2             |
        | 4             | 3rd        | 3             |

