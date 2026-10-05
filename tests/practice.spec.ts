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
    
    //await page.pause();
})

// new tab open test
test("Open new tab", async ({ page, context }) => { // context fixture needed to catch the new tab
    await page.goto("/dashboard/practice-components"); // relative path, baseURL set in playwright.config.ts
    const newPagePromise = context.waitForEvent('page'); // start listening BEFORE the click, else event missed
    await page.getByRole("button", { name: "Open New Tab" }).click();
    const newPage = await newPagePromise; // wait for the new tab to open, store its Page object in newPage
    await newPage.waitForLoadState(); // wait untill new page loads fully
    //assertion
    expect(newPage.url()).toContain("example.com");
    await newPage.close();
});

//new window test
test("New window handling", async({page, context})=>{
    await page.goto("/dashboard/practice-components"); // relative path, baseURL set in playwright.config.ts
    const newPagePromise = context.waitForEvent('page'); // start listening BEFORE the click, else event missed
    await page.getByRole("button", { name: "Open New Window" }).click();
    const newPage = await newPagePromise; // wait for the new tab to open, store its Page object in newPage
    await newPage.waitForLoadState(); // wait untill new page loads fully
    //assertion
    expect(newPage.url()).toContain("example.com");
    await newPage.close();
});

// open modal test
test("Open Modal", async({page})=>{
    await page.goto("/dashboard/practice-components");
    await page.locator("#openModalBtn").click(); // for practice purpose using locator but we can use page.getByRole as same like earlier onces
    
    // once modal button click now verify if modal is open or not
    const modal = await page.getByRole("dialog"); 
    await expect(modal).toBeVisible(); // here toBeVisible defiles if element is currently visible on the webpage.
    const modalText = await modal.textContent();  //gets the text inside the modal.
    console.log(modalText);

    //let's say there are multiple close button in a single model or anywhere. then instead of first we can use --> .nth(0) index means which position 
    await modal.getByRole("button", { name: "Close" }).first().click(); // click close to close the model as close has use multiple times so first defines this close is on first
    await expect(modal).not.toBeVisible(); // verify if model is close or not --> so simply used not before toBeVisible
});

//Date Time Input
test("NextJS Datetime input", async ({page})=>{
    await page.goto("/dashboard/practice-components");
    const dateTimeElement = await page.locator("[type=datetime-local]"); //locator for date and time
    await dateTimeElement.fill('2026-10-08T23:42'); // date and time format -> 2026-10-05T11:42 here t11:45 is time and its in 24hr format
    // await page.pause();

})

//Date Picker - readonly
test("React DatePicker ReadOnly", async ({page}) => {
    await page.goto("/dashboard/practice-components");
    const dateElem = await page.locator('[readonly]').elementHandle(); // locating date and raw DOM handle, needed for evaluate()

    // readonly input blocks typing, so set the value directly in the browser DOM
    await dateElem!.evaluate((el: HTMLInputElement) => { // run this function inside the browser, el = the real input element
        el.removeAttribute('readonly'); //removing readonly
        el.value = "2026-01-01"; 
        el.dispatchEvent(new Event('change', { bubbles: true })); // tell React the value changed
    });

    console.log(await dateElem!.inputValue()); // read the value back to confirm it was set
});

//date picker - write
test("React DatePicker", async ({ page }) => {
    await page.goto("/dashboard/practice-components");
    const reactDatePicker = page.getByPlaceholder("Select date"); // partial placeholder text matches by default
    await reactDatePicker.click(); // focus input, opens the calendar popup
    await reactDatePicker.fill("08/15/2026"); // type the date in the format the picker expects (MM/DD/YYYY)
    await page.keyboard.press("Enter"); // confirm the typed date so the picker accepts it
    console.log(await reactDatePicker.inputValue()); // read the value back to confirm it was set
});

//iFrame handling
test("handle iFrame", async ({ page }) => {
    await page.goto("/dashboard/practice-components");
    const frame = page.frameLocator('iframe'); // elements inside an iframe can't be reached via page, go through frameLocator
    await frame.getByRole("textbox", { name: "you@example.com" }).fill('admin@test.com'); // name matches the placeholder text
    await frame.getByRole("textbox", { name: "Enter password" }).fill('1234');
    await frame.getByRole("button", { name: "Login" }).click();
    //await page.pause();
})

