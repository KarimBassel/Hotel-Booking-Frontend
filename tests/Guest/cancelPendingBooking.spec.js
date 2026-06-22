import { test, expect } from '@playwright/test';

test('guest can cancel pending booking', async ({ page }) => {

  try {
    const email = 'e2e@test.com';
    const password = '123456';

    // Login
    await page.goto(`${process.env.VITE_FRONTEND_URL}/login`);

    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByTestId('login-password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    // Wait until loading is gone
    await expect(
      page.getByText('Logging in...')
    ).toBeHidden();

    await expect(
      page.getByRole('link', { name: 'Hotels' })
    ).toBeVisible();

    // Navigate to hotel
    await page.getByRole('link', { name: 'Hotels' }).click();
    await page.getByRole('heading', { name: 'Grand Nile Hotel' }).click();

    // Book room
    await page.getByRole('button', { name: 'Book' }).first().click();

    await page.getByRole('textbox').first().fill('2083-02-08');
    await page.getByRole('textbox').nth(1).fill('2083-02-09');

    const proceedButton = page.getByRole('button', {
      name: 'Proceed to Payment'
    });

    await expect(proceedButton).toBeEnabled();
    await proceedButton.click();

    // Wait until loading is gone
    await expect(
      page.getByText('Processing...')
    ).toBeHidden();

    // Wait for booking creation to finish
    await expect(
      page.getByRole('link', { name: 'Bookings' })
    ).toBeVisible();

    // Go to bookings page
    await page.getByRole('link', { name: 'Bookings' }).click();

        // Wait until loading is gone
    await expect(
      page.getByText('Loading...')
    ).toBeHidden();

    // Wait for bookings to load
    const bookingCard = page.locator('.booking-card').last();

    await expect(bookingCard).toBeVisible();
    await expect(bookingCard).toContainText('PENDING');

    // Cancel booking
    await page.getByRole('button', { name: 'Cancel' }).last().click();

    await page.waitForURL('**/bookings');

    // Wait until updated card is rendered
    const cancelledBooking = page.locator('.booking-card').last();

    await expect(cancelledBooking).toBeVisible();
    await expect(cancelledBooking).toContainText('2/8/2083');
    await expect(cancelledBooking).toContainText('2/9/2083');
    await expect(cancelledBooking).toContainText('CANCELLED');

  } finally {

    try {
      await fetch(
        `${process.env.VITE_BACKEND_URL}/api/test/cleanup-bookings`,
        { method: 'DELETE' }
      );
    } catch (error) {
      console.error('Error deleting bookings:', error);
    }

  }
});