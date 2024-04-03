import { Page } from '@playwright/test';

enum textValues {
  username = 'Username',
  password = 'Password',
  login = 'Login',
}

enum id {
  burgerMenu = '[id="react-burger-menu-btn"]',
  logoutSidebar = '[id="logout_sidebar_link"]',
}

export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    await this.page.getByPlaceholder(textValues.username).fill(username);
    await this.page.getByPlaceholder(textValues.password).fill(password);
    await this.page.getByRole('button', { name: textValues.login }).click();
  }

  async logout() {
    await this.page.locator(id.burgerMenu).click();
    await this.page.locator(id.logoutSidebar).click();
  }
}
