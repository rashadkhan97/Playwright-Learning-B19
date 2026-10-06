import { test, expect } from '@playwright/test';
import {faker} from "@faker-js/faker";
import { generateRandomNumber } from '../utils/randomNumber';
import { CreateUserPage, UserModel } from '../pages/CreateUserPage.pom';


test("Create new user", async({page})=>{
    let createUserPage = new CreateUserPage(page);
    let randomId = generateRandomNumber(1000000, 9999999);
    await page.goto("/dashboard/add-user");
    const user:UserModel={
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phoneNumber: `0140${randomId}`,
        password: '1234',
        birthDate: "01/01/2025",
        district: "Dhaka",
        gender: "Male",
        photoUrl: "resources/sinchan-avater.jpg"
    }

    await createUserPage.createUser(user);
    await expect(page).toHaveURL("/dashboard/users"); // assertion 
    await page.pause();
})