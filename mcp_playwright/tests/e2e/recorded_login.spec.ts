import { test } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { HomePage } from '../pages/home';

const user = 'standard_user';
const password = 'secret_sauce';

test.describe('Recorded Login and Validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await new LoginPage(page).login(user, password);
    });

    test('should verify items on the inventory page', async ({ page }) => {
        const homePage = new HomePage(page);
        // Validating "Sauce Labs Fleece Jacket" with recorded color
        await homePage.validateCardInfo('Sauce Labs Fleece Jacket', 'rgb(24, 88, 58)');
    });
});
