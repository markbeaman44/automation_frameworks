import { t } from 'testcafe';
import { screen } from '@testing-library/testcafe';

enum textValues {
  username = 'Username',
  password = 'Password',
  login = 'Login',
}

enum id {
  burgerMenu = '[id="react-burger-menu-btn"]',
  logoutSidebar = '[id="logout_sidebar_link"]',
}

export async function login(username: string, password: string) {
  await t.typeText(screen.getByPlaceholderText(textValues.username), username, { replace: true });
  await t.typeText(screen.getByPlaceholderText(textValues.password), password, { replace: true });
  await t.click(screen.findByRole('button', { name: textValues.login }));
}

export async function logout() {
  await t.click(id.burgerMenu);
  await t.wait(1000);
  await t.click(id.logoutSidebar);
}
