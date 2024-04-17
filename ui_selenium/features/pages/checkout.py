from selenium.webdriver.common.by import By
from features.support.constant import storeValues
from features.support.helpers import validate

def searchArrayInList(nameKey: str, myArray: any):
	return [x for x in myArray if x['name'] == nameKey][0]

# // ASSERTSIONS //
def validateItemsInCart(context, storedValues: any):
	print("mark", storedValues)
	nameResult = context.driver.find_element(By.XPATH, f'//div[contains(text(), "{storedValues["title"]}")]//ancestor::div[@class="cart_item"]//div[@class="inventory_item_name"]')
	validate(storedValues["title"], nameResult.text)

	priceResult = context.driver.find_element(By.XPATH, f'//div[contains(text(), "{storedValues["title"]}")]//ancestor::div[@class="cart_item"]//div[@class="inventory_item_price"]')
	validate(storedValues["price"], priceResult.text)

def ValidateTotalCart(context, itemTotal: str):
	results = context.driver.find_elements(By.CSS_SELECTOR, '[class="cart_item"]')
	validate(int(itemTotal), len(results))

def ValidateItemInCart(context, itemValue: str):
	storedValues = searchArrayInList(itemValue, storeValues)
	validateItemsInCart(context, storedValues)

def ValidatesAllInCart(context):
	for x in range(len(storeValues)):
		validateItemsInCart(context, storeValues[x])
