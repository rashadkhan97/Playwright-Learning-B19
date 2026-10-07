import {Page, Locator, expect} from "@playwright/test";

// POM for login screen. Used by tests/auth.setup.ts to log in once and save auth.json
export class LoginPage{
    //declearing properties
    readonly page:Page;
    readonly emailInput:Locator;
    readonly passwordInput:Locator;
    readonly loginButton:Locator;
    readonly profileHeading:Locator; // shown only after successful login, used as the "login done" signal

    //constructor: receives page from the test/setup file, builds all locators once
    constructor(page:Page){
        this.page = page;
        this.emailInput=page.getByRole("textbox", {name: "you@example.com"});
        this.passwordInput=page.getByRole("textbox", {name: "Enter password"});
        this.loginButton=page.getByRole("button", {name: "Login"});
        this.profileHeading=page.getByRole("heading", {name: "Profile"});

    }

    // full login flow, called from auth.setup.ts
    async login(email:string, password:string){
        await this.page.goto("/"); // baseURL defined in playwright.config.ts
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        // wait for Profile heading, so login is finished before returning
        await expect(this.profileHeading).toContainText('Profile');
    }

}