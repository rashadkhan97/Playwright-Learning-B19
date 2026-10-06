import {Page, Locator} from "@playwright/test";

export interface UserModel{
    firstName:string,
    lastName:string,
    email:string,
    phoneNumber:string,
    password:string,
    birthDate:string,
    district:string,
    gender: 'Male'| 'Female',
    photoUrl:string
}

export class CreateUserPage{
    //declearing properties 
    readonly page:Page;
    readonly firstNameInput:Locator;
    readonly lastNameInput:Locator;
    readonly emailInput:Locator;
    readonly passwordInput:Locator;
    readonly phoneNumber:Locator;
    readonly birthdateInput:Locator;
    readonly bloodGroupSelect:Locator;
    readonly districtSelect:Locator;
    readonly genderSelect:Locator;
    readonly checkBoxSelect:Locator;
    readonly photoUrlInput:Locator;
    readonly createUserButton:Locator;

    //constructor
    constructor(page:Page){
        this.page = page;
        this.firstNameInput= page.getByRole("textbox", {name: "John", exact:true});
        this.lastNameInput=page.getByRole("textbox", {name: "Doe"});
        this.emailInput=page.getByRole("textbox", {name: "john@example.com"});
        this.phoneNumber=page.getByRole("textbox", {name: "Must start with 01 and be 11 digits"});
        this.bloodGroupSelect=page.getByRole("combobox").first();
        this.passwordInput=page.getByRole("textbox", {name: "create a password"});
        this.birthdateInput=page.getByPlaceholder("MM/dd/yyyy");
        this.districtSelect=page.getByRole("combobox").nth(1);
        this.genderSelect=page.getByRole("radio", {name: "Male", exact:true});
        this.checkBoxSelect=page.getByRole("checkbox");
        this.photoUrlInput=page.locator("#photoInput");
        this.createUserButton=page.getByRole("button", {name: "Create User"});

    }

    async createUser(user:UserModel){
        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.emailInput.fill(user.email);
        await this.phoneNumber.fill(user.phoneNumber);

        // blood group dropdown: open, move down, pick
        await this.bloodGroupSelect.click();
        await this.bloodGroupSelect.press("ArrowDown");
        await this.bloodGroupSelect.press("Enter");

        await this.passwordInput.fill(user.password);

        // birth date: clear existing text, type key by key so date input processes each keystroke
        await this.birthdateInput.click();
        await this.birthdateInput.selectText();
        await this.birthdateInput.press("Backspace");
        await this.birthdateInput.pressSequentially(user.birthDate, {delay: 150});
        await this.birthdateInput.press("Enter");

        await this.districtSelect.selectOption(user.district);
        // gender from data, not the hardcoded "Male" locator
        await this.page.getByRole("radio", {name: user.gender, exact:true}).check();
        await this.checkBoxSelect.check();
        await this.photoUrlInput.setInputFiles(user.photoUrl);
        await this.createUserButton.click();
    }

}