### Selenium + Python + Behave (BDD)
**Latest Versions (as of 2026):**
- selenium: ^4.x.x (or latest)
- behave: ^1.x.x
- python: ^3.10+

**Structure:**
```
ui_selenium/
├── behaverc
├── Dockerfile
├── docker-compose.yaml
├── Makefile
├── requirements.txt
├── README.md
└── features/
    ├── __init__.py
    ├── environment.py
    ├── feature_files/
    │   └── *.feature
    ├── steps/
    │   ├── given.py
    │   ├── when.py
    │   ├── then.py
    │   └── __init__.py
    ├── pages/
    │   ├── login.py
    │   └── __init__.py
    └── support/
        ├── constant.py
        ├── helpers.py
        └── __init__.py
```

**requirements.txt:**
```
selenium>=4.0.0
behave>=1.2.6
webdriver-manager>=4.0.0
```

**Page Object Example (features/pages/login.py):**
```python
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LoginSelectors:
    USERNAME = (By.CSS_SELECTOR, '[data-test="username"]')
    PASSWORD = (By.CSS_SELECTOR, '[data-test="password"]')
    LOGIN_BUTTON = (By.CSS_SELECTOR, '[data-test="login-button"]')
    ERROR_MESSAGE = (By.CSS_SELECTOR, '[data-test="error"]')

def login(context, username: str, password: str) -> None:
    driver = context.driver
    wait = WebDriverWait(driver, 10)
    
    username_input = wait.until(EC.presence_of_element_located(LoginSelectors.USERNAME))
    username_input.send_keys(username)
    
    password_input = driver.find_element(*LoginSelectors.PASSWORD)
    password_input.send_keys(password)
    
    login_button = driver.find_element(*LoginSelectors.LOGIN_BUTTON)
    login_button.click()

def navigate_to_login_page(context) -> None:
    context.driver.get('https://www.saucedemo.com')

def verify_error_message(context, expected_message: str) -> None:
    driver = context.driver
    wait = WebDriverWait(driver, 10)
    error_element = wait.until(EC.presence_of_element_located(LoginSelectors.ERROR_MESSAGE))
    assert expected_message in error_element.text
```

**environment.py:**
```python
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def before_all(context):
    context.base_url = 'https://www.saucedemo.com'

def before_scenario(context, scenario):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    service = Service(ChromeDriverManager().install())
    context.driver = webdriver.Chrome(service=service, options=options)
    context.driver.maximize_window()

def after_scenario(context, scenario):
    context.driver.quit()
```

**Makefile:**
```makefile
.PHONY: install test test-local clean

install:
	pip install -r requirements.txt

test:
	behave features/feature_files

test-local:
	behave features/feature_files --tags=@smoke

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
```
