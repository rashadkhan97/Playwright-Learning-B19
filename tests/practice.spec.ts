import { test, expect } from '@playwright/test';

// login page test
test("user login", async({page})=>{
    await page.goto("/"); // as baseurl already defined inside playwright.config.ts line 29
    await page.getByRole("textbox", {name: "you@example.com"}).fill('admin@test.com');
    await page.getByRole("textbox", {name: "Enter password"}).fill('1234');
    await page.getByRole("button", {name: "Login"}).click();

    //assertion type 1 ( note here is given two types of assertion we can choose any of 1 so currently i've choosed 2 and 1 is commented)
    // const profileHeader = await page.getByRole('heading', {name:"Profile"}).textContent();
    // await expect(profileHeader?.includes("Profile"));

    await expect(page.getByRole('heading', {name:"Profile"})).toContainText('Profile'); //assertion type 2
    await page.context().storageState({path:"auth.json"}); // login details will be saved on auth.json file with the help of storageState
    
})

// double click on button test
test("Double Button click", async({page}) => {
    await page.goto("/dashboard/practice-components"); // as baseurl already defined inside playwright.config.ts line 29 so writing next parts only
    
    let alertMessage = ""; // 1. Create an empty variable to store the alert message later
    
    // 2. Listen for any browser dialog (alert/popup) //    When a dialog appears, this function will automatically run
    await page.on("dialog", async dialog => {
        alertMessage = dialog.message();// Get the text/message from the alert // Example: "Double clicked!"
        await dialog.accept();    // Accept/OK the alert
    })

    await page.getByRole("button", { name: "Double Click Me" }).dblclick(); // 3. Find the "Double Click Me" button and double-click it //    → This action will trigger the browser alert
    console.log(alertMessage);  // 4. Print the alert message stored in alertMessage //    Expected output: Double clicked!
    
    //await page.pause(); // use when u need to pause
})

// right click on button test
test("Context Button click", async({page}) => {
    await page.goto("/dashboard/practice-components"); // as baseurl already defined inside playwright.config.ts line 29 so writing next parts only
    
    let alertMessage = "";
    await page.on("dialog", async dialog => {
        alertMessage = dialog.message();
        await dialog.accept();
    })

    await page.getByRole("button", { name: "Right Click Me" }).click({button: 'right'});  // inside click --> button: right means right click on button
    console.log(alertMessage);
    
    await page.pause();
})