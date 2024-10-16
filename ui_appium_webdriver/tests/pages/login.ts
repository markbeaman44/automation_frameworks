enum accessibilityId {
  username = '~test-Username',
  password = '~test-Password',
  login = '~test-LOGIN',
  logout = '~test-LOGOUT',
  burgerMenu = '~test-Menu',
}

export async function login(username: string, password: string) {
  const usernameField = await browser.$(accessibilityId.username);
  await usernameField.clearValue();
  await usernameField.setValue(username);

  const passwordField = await browser.$(accessibilityId.password);
  await passwordField.clearValue();
  await passwordField.setValue(password);

  await browser.$(accessibilityId.login).click();
}

export async function logout() {
  await browser.$(accessibilityId.burgerMenu).click();
  await browser.pause(1000);
  await browser.$(accessibilityId.logout).click();

  await browser.deleteCookies();
}
