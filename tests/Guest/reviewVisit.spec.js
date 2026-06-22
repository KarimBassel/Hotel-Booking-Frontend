import { test, expect } from "@playwright/test";

test('Submit & Update User Review', async ({ page }) => {

  try{

    // Create past booking for review tests
    const response = await fetch(
      `${process.env.VITE_BACKEND_URL}/api/test/addpastbooking`,
      {method : "GET"}
    );

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
    await page.waitForTimeout(10000);
    await page.goto(`${process.env.VITE_FRONTEND_URL}/bookings`);
    //Make sure review recorded
    await page.waitForTimeout(20000);
    await page.getByRole('link', { name: 'Reviews' }).click();
    await expect(page.getByRole('paragraph')).toContainText('Very good service, Keep up the good work!');
    //await page.pause();
    //Update Review
    await page.getByRole('link', { name: 'Bookings' }).click();
    await page.getByRole('button', { name: 'Review Visit' }).first().click();
    await page.getByRole('textbox', { name: 'Tell us about your experience' }).click();
    await page.getByRole('textbox', { name: 'Tell us about your experience' }).fill('Comment Updated');
    await page.getByRole('button', { name: 'Update Review' }).click();
    await page.goto(`${process.env.VITE_FRONTEND_URL}/bookings`);
    //Make sure review updated
    await page.getByRole('link', { name: 'Reviews' }).click();
    await expect(page.getByRole('paragraph')).toContainText('Comment Updated');
  }finally{

      try{
        // Delete the review created during the test
        const response = await fetch(
          `${process.env.VITE_BACKEND_URL}/api/test/cleanup-bookings`,
          {method : "DELETE"}
        );
      }catch (error) {
        console.error("Error deleting past booking:", error);
      }

    }

});