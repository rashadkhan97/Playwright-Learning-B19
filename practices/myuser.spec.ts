import { test, expect } from '@playwright/test';
import {faker} from "@faker-js/faker";
import { generateRandomNumber } from '../utils/randomNumber';
import { CreateUserPage, UserModel } from '../pages/CreateUserPage.pom';
// login page test
// as we shifted to POM Structure and OOP so it will stay only for learning
test.skip("Add new user", async({page})=>{
    await page.goto("/dashboard/add-user"); // as baseurl already defined inside playwright.config.ts line 29
    await page.getByRole("textbox", {name: "John", exact:true}).fill('New Test'); //exact: true = accessible name must equal "John" fully
    await page.getByRole("textbox", {name: "Doe"}).fill('User 01');

    // random email address & 7 digit of phone number generate generate
    let email = faker.internet.email();
    let randomId = generateRandomNumber(10000000, 99999999);
    await page.getByRole("textbox", {name: "john@example.com"}).fill(email); // fill(email) --> randomEmail from faker library
    await page.getByRole("textbox", {name: "Must start with 01 and be 11 digits"}).fill(`014${randomId}`); //phone number contacted with randomId
    
    //blood group dropdown box
    const cbBloodGroup = await page.getByRole("combobox").first();
    await cbBloodGroup.click();
    await cbBloodGroup.press("ArrowDown");
    await cbBloodGroup.press("Enter"); // to select any blood color
    await page.getByRole("textbox", {name: "create a password"}).fill("1234"); //password

    // date and birth select box
    const txtBirthDate = await page.getByPlaceholder("MM/dd/yyyy");
    await txtBirthDate.click();
    await txtBirthDate.selectText(); //select the texts which are already written
    await txtBirthDate.press("Backspace"); // then backspace to remove the earlier text
    await txtBirthDate.pressSequentially("01/01/2025", {delay: 150}); // type key by key with 150ms delay so the date input can process each keystroke
    await txtBirthDate.press("Enter");

    //District select box
    await page.getByRole("combobox").nth(1).selectOption("Mymensing"); //As there are 2 dropdown box in this page , so nth(1) means 2nd index or 2th position box
    await page.getByRole("radio", {name: "Male", exact:true}).check(); //exact: true, only radio labeled exactly "Male" match. Avoid strict mode violation (2 elements found).
    await page.getByRole("checkbox").check(); // click on confirm checkbox

     // Update profile picture
    await page.locator("#photoInput").setInputFiles("resources/tom-avater.jpg");
    // Create user button click once all fileds are filled properly
    await page.getByRole("button", {name: "Create User"}).click(); 

    // now assert once user is created does it take to --> Registred user profile or not
    await expect(page).toHaveURL("/dashboard/users") // assertion 
    await page.pause();
    
})