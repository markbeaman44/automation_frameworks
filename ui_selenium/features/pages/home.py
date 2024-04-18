from selenium.webdriver.common.by import By
from features.support.constant import store_values

def css_item_selector(item_position: str): 
    return f'[class="inventory_list"] [class="inventory_item"]:nth-of-type({item_position})'

def store_selected_values(context, item_position: str):
    price_value = context.driver.find_element(By.CSS_SELECTOR, f'{css_item_selector(item_position)} [class="inventory_item_price"]')
    name = context.driver.find_element(By.CSS_SELECTOR, f'{css_item_selector(item_position)} [class="inventory_item_label"] > a')

    store_values.append({ 'name': item_position, 'title': name.text, 'price': price_value.text })

def select_item(context, item_position: str):
    store_selected_values(context, item_position)
    context.driver.find_element(By.CSS_SELECTOR, f'{css_item_selector(item_position)} button').click()

def go_to_shopping_cart(context):
    context.driver.find_element(By.CSS_SELECTOR, '[id="shopping_cart_container"]').click()

def select_random_items(context, item_random_items: int):
    for x in range(int(item_random_items)):
        select_item(context, str(x + 1))
