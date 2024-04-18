from enum import Enum
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class text_values(Enum):
	username = 'Username'
	password = 'Password'
	login = 'Login'

class id(Enum):
	burger_menu = 'react-burger-menu-btn'
	logout_sidebar = 'logout_sidebar_link'
	login_button = 'login-button'

def login(context, username: str, password: str):
	WebDriverWait(context.driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, f'[placeholder={text_values.username.value}]')))
	context.driver.find_element(By.CSS_SELECTOR, f'[placeholder={text_values.username.value}]').send_keys(username)
	context.driver.find_element(By.CSS_SELECTOR, f'[placeholder={text_values.password.value}]').send_keys(password)
	context.driver.find_element(By.ID, id.login_button.value).click()

def logout(context):
	WebDriverWait(context.driver, 5).until(EC.presence_of_element_located((By.ID, id.burger_menu.value)))
	context.driver.find_element(By.ID, id.burger_menu.value).click()
	time.sleep(1)
	context.driver.find_element(By.ID, id.logout_sidebar.value).click()
