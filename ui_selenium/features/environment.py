
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

from features.pages.login import logout
from features.support.constant import storeValues

def before_all(context):
	is_local = os.environ.get("LOCAL")

	if is_local == "true":
		context.driver = webdriver.Chrome()
	else:
		chrome_options = Options()
		chrome_options.add_argument('--headless')
		chrome_options.add_argument('--no-sandbox')
		chrome_options.add_argument('--disable-dev-shm-usage')
		context.driver = webdriver.Chrome(chrome_options)

	context.driver.get("https://www.saucedemo.com/")

def after_scenario(context, scenario):
	logout(context)
	storeValues = []
	context.driver.execute_script("window.localStorage.clear();")

def after_all(context):
	context.driver.quit()
