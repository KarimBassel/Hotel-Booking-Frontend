import { test, expect } from '@playwright/test';

test('guest can cancel pending booking', async ({ page }) => {

  try{
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

      await page.getByRole('textbox').first().fill('2083-02-08');
      await page.getByRole('textbox').nth(1).fill('2083-02-09');

      await page.getByRole('button', { name: 'Proceed to Payment' }).click();
      await page.waitForTimeout(1000);


      await page.getByRole('link', { name: 'Bookings' }).click();
      await page.waitForTimeout(1000); 
      const bookingCard = page.locator('.booking-card').last();
      await expect(bookingCard).toContainText('PENDING');

      await page.getByRole('button', { name: 'Cancel' }).last().click();

      await page.waitForURL('**/bookings');

      await expect(bookingCard).toContainText('2/8/2083');
      await expect(bookingCard).toContainText('2/9/2083');
      await expect(bookingCard).toContainText('CANCELLED');

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