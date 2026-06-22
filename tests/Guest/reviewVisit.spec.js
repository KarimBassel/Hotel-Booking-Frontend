import { test, expect } from "@playwright/test";

test('Submit & Update User Review', async ({ page }) => {
  try {
    // Create past booking for review tests
    await fetch(
      `${process.env.VITE_BACKEND_URL}/api/test/addpastbooking`,
      { method: "GET" }
    );

    const email = "e2e@test.com";
    const password = "123456";

    // Login
    await page.goto(`${process.env.VITE_FRONTEND_URL}/login`);

    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByTestId('login-password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Open review page
    await page.getByRole('link', { name: 'Bookings' }).click();
    await page.getByRole('button', { name: 'Review Visit' }).first().click();

    // Submit review
    await page.getByText('★').nth(4).click();

    await page
      .getByRole('textbox', {
        name: 'Tell us about your experience'
      })
      .fill('Very good service, Keep up the good work!');

    await page.getByRole('button', { name: 'Submit Review' }).click();

    // Wait for navigation back to bookings
    await page.waitForURL('**/bookings');

    // Verify review appears
    await page.getByRole('link', { name: 'Reviews' }).click();

    await expect(async () => {
      await page.reload();

      await expect(
        page.getByText('Very good service, Keep up the good work!')
      ).toBeVisible();
    }).toPass({
      timeout: 30000,
      intervals: [1000, 2000, 3000]
    });

    // Update review
    await page.getByRole('link', { name: 'Bookings' }).click();
    await page.getByRole('button', { name: 'Review Visit' }).first().click();

    await page
      .getByRole('textbox', {
        name: 'Tell us about your experience'
      })
      .fill('Comment Updated');

    await page.getByRole('button', { name: 'Update Review' }).click();

    await page.waitForURL('**/bookings');

    // Verify updated review appears
    await page.getByRole('link', { name: 'Reviews' }).click();

    await expect(async () => {
      await page.reload();

      await expect(
        page.getByText('Comment Updated')
      ).toBeVisible();
    }).toPass({
      timeout: 30000,
      intervals: [1000, 2000, 3000]
    });

  } finally {
    try {
      await fetch(
        `${process.env.VITE_BACKEND_URL}/api/test/cleanup-bookings`,
        { method: "DELETE" }
      );
    } catch (error) {
      console.error("Error deleting test bookings:", error);
    }
  }
});