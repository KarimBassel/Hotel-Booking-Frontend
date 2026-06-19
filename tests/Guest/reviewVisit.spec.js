import { test, expect } from "@playwright/test";

test('Submit & Update User Review', async ({ page }) => {
  const email = "e2e@test.com";
  const password = "123456";

  await page.goto(`${process.env.VITE_FRONTEND_URL}/login`);
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByTestId('login-password').click();
  await page.getByTestId('login-password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Bookings' }).click();
  await page.getByRole('button', { name: 'Review Visit' }).first().click();

  //Submit new Review
  await page.getByText('★').nth(4).click();
  await page.getByRole('textbox', { name: 'Tell us about your experience' }).click();
  await page.getByRole('textbox', { name: 'Tell us about your experience' }).fill('Very good service, Keep up the good work!');
  await page.getByRole('button', { name: 'Submit Review' }).click();
  await page.goto(`${process.env.VITE_FRONTEND_URL}/bookings`);
  //Make sure review recorded
  await page.getByRole('link', { name: 'Reviews' }).click();
  await expect(page.getByRole('paragraph')).toContainText('Very good service, Keep up the good work!');

    //Update Review
  await page.getByRole('link', { name: 'Bookings' }).click();
  await page.getByRole('button', { name: 'Review Visit' }).first().click();
  await page.getByRole('textbox', { name: 'Tell us about your experience' }).click();
  await page.getByRole('textbox', { name: 'Tell us about your experience' }).fill('Comment Updated');
  await page.getByRole('button', { name: 'Update Review' }).click();
  await page.goto('http://localhost:5173/bookings');
  //Make sure review updated
  await page.getByRole('link', { name: 'Reviews' }).click();
  await expect(page.getByRole('paragraph')).toContainText('Comment Updated');
});