from behave import when
from features.pages.home import select_item, select_random_items, go_to_shopping_cart

@when('the user selects the "{item_position}" item from the results lists')
@when('selects the "{item_position}" item from the results lists')
def step_impl(context, item_position: str):
	select_item(context, item_position)

@when('the user selects a total of "{item_random_items}" items')
@when('selects a total of "{itemRandomItems}" items')
def step_impl(context, item_random_items: str):
	select_random_items(context, int(item_random_items))

@when('the user goes to shopping cart')
@when('goes to shopping cart')
def step_impl(context):
	go_to_shopping_cart(context)
