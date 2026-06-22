import { chromium, test, expect } from "@playwright/test";
import fs from "fs";
import dotenv from "dotenv";


export default async function globalSetup() {
  //Loads environment variables from .env file into process.env
  dotenv.config();
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const email = "e2e@test.com";
  const password = "123456";

  const dir = "playwright/.auth";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await page.goto(`${process.env.VITE_FRONTEND_URL}/login`);

  await page.getByRole("button", { name: "Create account" }).click();

  await page.getByRole("textbox", { name: "Full name" }).fill("E2E User");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByTestId("password").fill(password);
  await page.getByTestId("confirm-password").fill(password);
  await page.getByRole("textbox", { name: "Phone number" }).fill("01234567890");

  await page.getByRole("button", { name: "Create account" }).click();

  await page.waitForTimeout(1000);

  //Assert that account is created
  await expect(page.getByTestId("register-meta")).toContainText('Account created.');


  // try{
  //   // Create past booking for review tests
  //   const response = await fetch(
  //     `${process.env.VITE_BACKEND_URL}/api/test/addpastbooking`,
  //     {method : "GET"}
  //   );
  // }catch (error) {
  //   console.error("Error creating past booking:", error);
  // }



  await browser.close();
}