from behave import when
from features.pages.home import selectItem, selectRandomItems, goToShoppingCart

@when('the user selects the "{itemPosition}" item from the results lists')
@when('selects the "{itemPosition}" item from the results lists')
def step_impl(context, itemPosition: str):
	selectItem(context, itemPosition)

@when('the user selects a total of "{itemRandomItems}" items')
@when('selects a total of "{itemRandomItems}" items')
def step_impl(context, itemRandomItems: str):
	selectRandomItems(context, int(itemRandomItems))

@when('the user goes to shopping cart')
@when('goes to shopping cart')
def step_impl(context):
	goToShoppingCart(context)
