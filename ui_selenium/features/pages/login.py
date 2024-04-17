from enum import Enum
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class textValues(Enum):
	username = 'Username'
	password = 'Password'
	login = 'Login'

class id(Enum):
	burgerMenu = 'react-burger-menu-btn'
	logoutSidebar = 'logout_sidebar_link'
	loginButton = 'login-button'

def login(context, username: str, password: str):
	WebDriverWait(context.driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, f'[placeholder={textValues.username.value}]')))
	context.driver.find_element(By.CSS_SELECTOR, f'[placeholder={textValues.username.value}]').send_keys(username)
	context.driver.find_element(By.CSS_SELECTOR, f'[placeholder={textValues.password.value}]').send_keys(password)
	context.driver.find_element(By.ID, id.loginButton.value).click()

def logout(context):
	WebDriverWait(context.driver, 5).until(EC.presence_of_element_located((By.ID, id.burgerMenu.value)))
	context.driver.find_element(By.ID, id.burgerMenu.value).click()
	time.sleep(1)
	context.driver.find_element(By.ID, id.logoutSidebar.value).click()
