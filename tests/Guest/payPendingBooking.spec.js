import { test, expect } from '@playwright/test';

test('guest can pay pending booking', async ({ page }) => {
  const email = 'e2e@test.com';
  const password = '123456';

  // Login
  await page.goto(`${process.env.VITE_FRONTEND_URL}/login`);

  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  // Navigate to hotel
  await page.getByRole('link', { name: 'Hotels' }).click();
  await page.getByRole('heading', { name: 'Grand Nile Hotel' }).click();

  // Book room
  await page.getByRole('button', { name: 'Book' }).first().click();

  await page.getByRole('textbox').first().fill('2083-02-06');
  await page.getByRole('textbox').nth(1).fill('2083-02-07');

  await page.getByRole('button', { name: 'Proceed to Payment' }).click();
  await page.waitForTimeout(1000);
  //Pay Pending Reservation
  await page.getByRole('link', { name: 'Bookings' }).click();
  await page.waitForTimeout(1000); 
  const bookingCard = page.locator('.booking-card').last();
  await expect(bookingCard).toContainText('PENDING');

  await page.getByRole('button', { name: 'View Details' }).last().click();
  await page.getByRole('button', { name: 'Proceed to Payment' }).click();


  const stripeFrame = page.frameLocator('iframe').first();
  await stripeFrame.locator('[placeholder="Card number"]').fill('4242424242424242');
  await stripeFrame.locator('[placeholder="MM / YY"]').fill('04/30');
  await stripeFrame.locator('[placeholder="CVC"]').fill('242');
  await stripeFrame.locator('[placeholder="ZIP"]').fill('12345');


  await page.getByRole('button', { name: /Pay/i }).click();

  await page.waitForURL('**/bookings');

  await expect(bookingCard).toContainText('2/6/2083');
  await expect(bookingCard).toContainText('2/7/2083');
  await expect(bookingCard).toContainText('CONFIRMED');
});