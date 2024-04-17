from behave import then
from features.pages.checkout import ValidateTotalCart, ValidateItemInCart, ValidatesAllInCart

@then('validates "{itemTotal}" items in shopping cart')
def step_impl(context, itemTotal: str):
	ValidateTotalCart(context, itemTotal)

@then('validates "{itemValue}" item title & price information')
def step_impl(context, itemValue: str):
	ValidateItemInCart(context, itemValue)

@then('validates all items information in shopping cart')
def step_impl(context):
	ValidatesAllInCart(context)
