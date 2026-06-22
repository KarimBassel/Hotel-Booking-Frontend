import { test, expect } from "@playwright/test";

test("user can update profile page", async ({ page }) => {
  const email = "e2e@test.com";
  const password = "123456";

  await page.goto(`${process.env.VITE_FRONTEND_URL}/login`);

  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByTestId("login-password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  // Wait until login completes and Profile link appears
  await expect(
    page.getByRole("link", { name: "Profile" })
  ).toBeVisible();

  await page.getByRole("link", { name: "Profile" }).click();

  // Wait until profile form loads
  const nameInput = page.getByTestId("name-input");
  await expect(nameInput).toBeVisible();

  await nameInput.fill("e2e updated");

  await page.getByRole("button", { name: "Update Profile" }).click();

  // Wait for success message
  await expect(
    page.getByTestId("profile-message")
  ).toHaveText("Profile updated successfully");

  // Verify value persisted
  await expect(nameInput).toHaveValue("e2e updated");
});