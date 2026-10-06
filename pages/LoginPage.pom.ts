import {Page, Locator, expect} from "@playwright/test";

export class LoginPage{
    //declearing properties
    readonly page:Page;
    readonly emailInput:Locator;
    readonly passwordInput:Locator;
    readonly loginButton:Locator;
    readonly profileHeading:Locator;

    //constructor
    constructor(page:Page){
        this.page = page;
        this.emailInput=page.getByRole("textbox", {name: "you@example.com"});
        this.passwordInput=page.getByRole("textbox", {name: "Enter password"});
        this.loginButton=page.getByRole("button", {name: "Login"});
        this.profileHeading=page.getByRole("heading", {name: "Profile"});

    }

    async login(email:string, password:string){
        await this.page.goto("/"); // baseURL defined in playwright.config.ts
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        // wait for Profile heading, so login is finished before returning
        await expect(this.profileHeading).toContainText('Profile');
    }

}