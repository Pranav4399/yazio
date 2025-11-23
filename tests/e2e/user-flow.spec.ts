import { expect, test } from '@playwright/test';
import { TestHelpers } from './test-utils';

test.describe('Yazio User Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await TestHelpers.setupMockData(page);
  });

  test('complete user onboarding flow', async ({ page }) => {
    const currentURL = page.url();
    const isOnWelcomePage = currentURL.includes('/welcome');

    const userData = await page.evaluate(() => {
      try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      } catch {
        return null;
      }
    });

    const isAuthenticated = userData !== null;

    if (isAuthenticated && isOnWelcomePage) {
      console.log('User already authenticated and on welcome page, skipping login');
    } else {
      await TestHelpers.login(page);
    }

    if (!currentURL.includes('/goal')) {
      await TestHelpers.completeWelcomeFlow(page);
    }

    await TestHelpers.completeGoalSetup(page);

    await TestHelpers.completeQuiz(page);

    await TestHelpers.completeSummary(page);

    await TestHelpers.completePayment(page);

    await expect(page).toHaveURL('/payment');
  });

  test('error handling - invalid login', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto('/');

    await page.fill('#username', 'invaliduser');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');
  });
});


