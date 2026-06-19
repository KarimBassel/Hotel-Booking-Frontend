// tests/profile.spec.js

import { test, expect } from "@playwright/test";

test("user can update profile page", async ({ page }) => {
  await page.goto(`${process.env.VITE_FRONTEND_URL}/login`);
  await page.waitForTimeout(1000);
  const email = "e2e@test.com";
  const password = "123456";
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByTestId("login-password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole('link', { name: 'Profile' }).click();

  await page.getByTestId("name-input").fill('e2e updated');
  await page.getByRole('button', { name: 'Update Profile' }).click();


  await expect(page.getByTestId("profile-message")).toHaveText('Profile updated successfully');
  await expect(page.getByTestId("name-input")).toHaveValue('e2e updated');

});