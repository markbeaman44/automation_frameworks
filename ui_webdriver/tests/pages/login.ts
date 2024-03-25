enum datatestId {
  username = '[data-test="username"]',
  password = '[data-test="password"]',
}

enum id {
  burgerMenu = '[id="react-burger-menu-btn"]',
  logoutSidebar = '[id="logout_sidebar_link"]',
}

export async function login(username: string, password: string) {
  const usernameField = await browser.$(datatestId.username);
  await usernameField.clearValue();
  await usernameField.setValue(username);

  const passwordField = await browser.$(datatestId.password);
  await passwordField.clearValue();
  await passwordField.setValue(password);

  await browser.$('[data-test="login-button"]').click();
}

export async function logout() {
  await browser.$(id.burgerMenu).click();
  await browser.pause(1000);
  await browser.$(id.logoutSidebar).click();

  await browser.deleteCookies();
}
