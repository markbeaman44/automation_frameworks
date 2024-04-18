from selenium.webdriver.common.by import By
from features.support.constant import store_values
from features.support.helpers import validate

def search_array_in_list(name_key: str, my_array: any):
	return [x for x in my_array if x['name'] == name_key][0]

# // ASSERTSIONS //
def validate_items_in_cart(context, stored_values: any):
	name_result = context.driver.find_element(By.XPATH, f'//div[contains(text(), "{stored_values["title"]}")]//ancestor::div[@class="cart_item"]//div[@class="inventory_item_name"]')
	validate(stored_values["title"], name_result.text)

	price_result = context.driver.find_element(By.XPATH, f'//div[contains(text(), "{stored_values["title"]}")]//ancestor::div[@class="cart_item"]//div[@class="inventory_item_price"]')
	validate(stored_values["price"], price_result.text)

def validate_total_cart(context, item_total: str):
	results = context.driver.find_elements(By.CSS_SELECTOR, '[class="cart_item"]')
	validate(int(item_total), len(results))

def validate_item_in_cart(context, item_value: str):
	stored_values = search_array_in_list(item_value, store_values)
	validate_items_in_cart(context, stored_values)

def validates_all_in_cart(context):
	for x in range(len(store_values)):
		validate_items_in_cart(context, store_values[x])
