import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.pom';

const authFile = 'auth.json'; // logged-in session gets saved here

// runs once before other tests (see "setup" project in playwright.config.ts)
setup('authenticate', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('admin@test.com', '1234');
    await page.context().storageState({ path: authFile }); // save cookies/local storage so other tests start already logged in; login() already waited for Profile heading, so auth.json is not saved empty
});
