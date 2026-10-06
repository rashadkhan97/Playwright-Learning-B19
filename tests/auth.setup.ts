import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.pom';

const authFile = 'auth.json'; // logged-in session gets saved here

// runs once before other tests (see "setup" project in playwright.config.ts)
setup('authenticate', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('admin@test.com', '1234');
    // save cookies/local storage so other tests start already logged in
    await page.context().storageState({ path: authFile });
});
