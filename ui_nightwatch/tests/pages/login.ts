import 'nightwatch';

enum textValues {
  username = 'Username',
  password = 'Password',
  login = 'Login',
}

enum id {
  burgerMenu = '[id="react-burger-menu-btn"]',
  logoutSidebar = '[id="logout_sidebar_link"]',
  loginButton = '[id=login-button]',
}

export async function login(username: string, password: string) {
  await browser.element.findByPlaceholderText(textValues.username).setValue(username);
  await browser.element.findByPlaceholderText(textValues.password).setValue(password);
  await browser.element.find(id.loginButton).click();
}

export async function logout() {
  await browser.element.find(id.burgerMenu).click();
  await browser.waitForElementVisible(id.logoutSidebar, 5000);
  await browser.element.find(id.logoutSidebar).click();
}
