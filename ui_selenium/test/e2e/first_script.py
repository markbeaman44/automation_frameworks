import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# before
is_local = os.environ.get("LOCAL")


if is_local == "true":
    driver = webdriver.Chrome()
else:
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(chrome_options)

driver.get("https://www.selenium.dev/selenium/web/web-form.html")

title = driver.title

driver.implicitly_wait(0.5)

# test

text_box = driver.find_element(By.NAME,"my-text")
submit_button = driver.find_element(By.CSS_SELECTOR,"button")

text_box.send_keys("Selenium")
submit_button.click()

message = driver.find_element(By.ID,"message")

text = message.text
expected = "Received!"
assert expected == text, f'Received: {text} expected: {expected}'
print(f'Received: {text} expected: {expected}')

# after

driver.quit()

# storeValues = []
# storeValues.append({'name': 'mark', 'title': 'the matrix'})
# >>> storeValues
# [{'name': 'mark', 'title': 'the matrix'}]
# >>> len(storeValues)
# 2

# >>> bb = [x for x in storeValues if x['name'] == 'mark']
# >>> bb
# [{'name': 'mark', 'title': 'the matrix'}]