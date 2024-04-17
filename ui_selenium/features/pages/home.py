from selenium.webdriver.common.by import By
from features.support.constant import storeValues

def cssItemSelector(itemPosition: str):
    return f'[class="inventory_list"] [class="inventory_item"]:nth-of-type({itemPosition})'

def storeSelectedValues(context, itemPosition: str):
    priceValue = context.driver.find_element(By.CSS_SELECTOR, f'{cssItemSelector(itemPosition)} [class="inventory_item_price"]')
    name = context.driver.find_element(By.CSS_SELECTOR, f'{cssItemSelector(itemPosition)} [class="inventory_item_label"] > a')

    storeValues.append({ 'name': itemPosition, 'title': name.text, 'price': priceValue.text })

def selectItem(context, itemPosition: str):
    storeSelectedValues(context, itemPosition)
    context.driver.find_element(By.CSS_SELECTOR, f'{cssItemSelector(itemPosition)} button').click()

def goToShoppingCart(context):
    context.driver.find_element(By.CSS_SELECTOR, '[id="shopping_cart_container"]').click()

def selectRandomItems(context, itemRandomItems: int):
    for x in range(int(itemRandomItems)):
        selectItem(context, str(x + 1))
