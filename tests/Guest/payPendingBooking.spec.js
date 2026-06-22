import { test, expect } from '@playwright/test';

test('guest can pay pending booking', async ({ page }) => {

  try {
    const email = 'e2e@test.com';
    const password = '123456';

    // Login
    await page.goto(`${process.env.VITE_FRONTEND_URL}/login`);

    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByTestId('login-password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      page.getByRole('link', { name: 'Hotels' })
    ).toBeVisible();

    // Navigate to hotel
    await page.getByRole('link', { name: 'Hotels' }).click();
    await page.getByRole('heading', { name: 'Grand Nile Hotel' }).click();

    // Book room
    await page.getByRole('button', { name: 'Book' }).first().click();

    await page.getByRole('textbox').first().fill('2083-02-06');
    await page.getByRole('textbox').nth(1).fill('2083-02-07');

    const proceedButton = page.getByRole('button', {
      name: 'Proceed to Payment'
    });

    await expect(proceedButton).toBeEnabled();

    await proceedButton.click();

    // Wait until loading is gone
    await expect(
      page.getByText('Processing...')
    ).toBeHidden();

    // Wait until booking creation completes
    await expect(
      page.getByRole('link', { name: 'Bookings' })
    ).toBeVisible();

    // Go to bookings
    await page.getByRole('link', { name: 'Bookings' }).click();

    // Wait until loading is gone
    await expect(
      page.getByText('Loading...')
    ).toBeHidden();

    const bookingCard = page.locator('.booking-card').first();

    await expect(bookingCard).toBeVisible();

    // Wait for pending booking to appear
    await expect(bookingCard).toContainText('PENDING');

    await page
      .getByRole('button', { name: 'View Details' })
      .last()
      .click();

    const paymentButton = page.getByRole('button', {
      name: 'Proceed to Payment'
    });

    await expect(paymentButton).toBeVisible();
    await paymentButton.click();

    // Wait for Stripe iframe
    const stripeFrame = page.frameLocator('iframe').first();

    await expect(
      stripeFrame.locator('[placeholder="Card number"]')
    ).toBeVisible();

    await stripeFrame
      .locator('[placeholder="Card number"]')
      .fill('4242424242424242');

    await stripeFrame
      .locator('[placeholder="MM / YY"]')
      .fill('04/30');

    await stripeFrame
      .locator('[placeholder="CVC"]')
      .fill('242');

    await stripeFrame
      .locator('[placeholder="ZIP"]')
      .fill('12345');

    await page.getByRole('button', { name: /Pay/i }).click();

    await page.waitForURL('**/bookings');

    // Wait until loading is gone
    await expect(
      page.getByText('Loading...')
    ).toBeHidden();

    // Now capture the booking card
    const confirmedBooking = page.locator('.booking-card').first();

    await expect(confirmedBooking).toBeVisible();

    await expect(confirmedBooking).toBeVisible();
    await expect(confirmedBooking).toContainText('2/6/2083');
    await expect(confirmedBooking).toContainText('2/7/2083');
    await expect(confirmedBooking).toContainText('CONFIRMED');

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