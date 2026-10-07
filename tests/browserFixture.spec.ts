import {test, expect} from "@playwright/test"
import { BrowserContext, Page } from "@playwright/test"
import { SUITES } from "../utils/suits"; 

// shared by all tests below: one context + one page created in beforeAll, reused instead of the per-test `page` fixture
let browserContext: BrowserContext;
let page: Page;

test.describe("Practice Automation", ()=>{

    test.describe.configure({mode:"serial"}) // it says run test serially.

    // runs once before all tests; `browser` fixture comes from Playwright
    test.beforeAll(async ({browser})=>{
        browserContext = await browser.newContext({storageState: 'auth.json'}); // auth.json is created by auth.setup.ts, so this context is already logged in
        page = await browserContext.newPage(); // the single page every test uses
    })

    // runs once after all tests; closes the context we opened manually
    test.afterAll(async ()=>{
        await browserContext.close();
    })

    // tag lets `--grep "@smoke"` pick this test; page.goto uses baseURL from playwright.config.ts
    test("Visit Practice Site", {tag:SUITES.smoke}, async() =>{
        await page.goto("/dashboard/practice-components")
    })

    // double click on button test
    test("Double Button click", {tag:SUITES.smoke}, async() => {
        await page.goto("/dashboard/practice-components")
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

    // open modal test
    test("Open Modal", async()=>{
        await page.goto("/dashboard/practice-components")
        await page.locator("#openModalBtn").click(); // for practice purpose using locator but we can use page.getByRole as same like earlier onces
        
        // once modal button click now verify if modal is open or not
        const modal = await page.getByRole("dialog"); 
        await expect(modal).toBeVisible(); // here toBeVisible defiles if element is currently visible on the webpage.
        const modalText = await modal.textContent();  //gets the text inside the modal.
        console.log(modalText);

        //let's say there are multiple close button in a single model or anywhere. then instead of first we can use --> .nth(0) index means which position 
        await modal.getByRole("button", { name: "Close" }).first().click(); // click close to close the model as close has use multiple times so first defines this close is on first
        await expect(modal).not.toBeVisible(); // verify if model is close or not --> so simply used not before toBeVisible
    })

    //Date Time Input
    test("NextJS Datetime input", {tag:SUITES.smoke}, async ()=>{
        await page.goto("/dashboard/practice-components")
        const dateTimeElement = await page.locator("[type=datetime-local]"); //locator for date and time
        await dateTimeElement.fill('2026-10-08T23:42'); // date and time format -> 2026-10-05T11:42 here t11:45 is time and its in 24hr format
        // await page.pause();

    })

    //date picker - write
    test("React DatePicker", async () => {
        await page.goto("/dashboard/practice-components");
        const reactDatePicker = page.getByPlaceholder("Select date"); // partial placeholder text matches by default
        await reactDatePicker.click(); // focus input, opens the calendar popup
        await reactDatePicker.fill("08/15/2026"); // type the date in the format the picker expects (MM/DD/YYYY)
        await page.keyboard.press("Enter"); // confirm the typed date so the picker accepts it
        console.log(await reactDatePicker.inputValue()); // read the value back to confirm it was set
    });

    //iFrame handling
    test("handle iFrame", {tag:SUITES.smoke}, async () => {
        await page.goto("/dashboard/practice-components");
        const frame = page.frameLocator('iframe'); // elements inside an iframe can't be reached via page, go through frameLocator
        await frame.getByRole("textbox", { name: "you@example.com" }).fill('admin@test.com'); // name matches the placeholder text
        await frame.getByRole("textbox", { name: "Enter password" }).fill('1234');
        await frame.getByRole("button", { name: "Login" }).click(); // same login form as LoginPage.pom.ts, but inside the iframe so POM can't be reused
        //await page.pause();
    })
})