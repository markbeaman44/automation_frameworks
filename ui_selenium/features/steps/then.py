from behave import then
from features.pages.checkout import validate_total_cart, validate_item_in_cart, validates_all_in_cart

@then('validates "{item_total}" items in shopping cart')
def step_impl(context, item_total: str):
	validate_total_cart(context, item_total)

@then('validates "{item_value}" item title & price information')
def step_impl(context, item_value: str):
	validate_item_in_cart(context, item_value)

@then('validates all items information in shopping cart')
def step_impl(context):
	validates_all_in_cart(context)
