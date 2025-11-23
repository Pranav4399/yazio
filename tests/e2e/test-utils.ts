import type { Page } from '@playwright/test';
import { mockFeatureFlags, mockUser, mockUserProfile } from './mock-data';

export class TestHelpers {
  static async login(page: Page) {
    await page.goto('/');
    await page.fill('#username', mockUser.username);
    await page.fill('#password', mockUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/welcome');
  }

  static async setupMockData(page: Page) {
    await page.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.addInitScript(() => {
      const originalFetch = window.fetch;
      window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === 'string' ? input : input.toString();

        if (url.includes('/rest/v1/users')) {
          return new Response(JSON.stringify([mockUser]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        if (url.includes('/rest/v1/user_profiles')) {
          return new Response(JSON.stringify(mockUserProfile), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        if (url.includes('/rest/v1/quiz_questions')) {
          return new Response(JSON.stringify({
            questions: [
              {
                id: 'q1',
                title: 'What is your main fitness goal?',
                description: 'This helps us personalize your experience',
                type: 'radio',
                required: true,
                options: [
                  { id: 'lose-weight', label: 'Lose weight' },
                  { id: 'gain-weight', label: 'Gain weight' },
                  { id: 'maintain-weight', label: 'Maintain weight' },
                  { id: 'build-muscle', label: 'Build muscle' }
                ]
              },
              {
                id: 'q2',
                title: 'How much time can you dedicate to meal prep?',
                type: 'radio',
                required: false,
                options: [
                  { id: '15min', label: '15 minutes or less' },
                  { id: '30min', label: '30 minutes' },
                  { id: '1hour', label: '1 hour or more' },
                  { id: 'flexible', label: 'Flexible' }
                ]
              },
              {
                id: 'q3',
                title: 'What type of recipes do you prefer?',
                type: 'radio',
                required: false,
                options: [
                  { id: 'quick', label: 'Quick and easy' },
                  { id: 'healthy', label: 'Healthy and nutritious' },
                  { id: 'variety', label: 'Variety of cuisines' }
                ]
              }
            ]
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        if (url.includes('/rest/v1/feature_flags')) {
          return new Response(JSON.stringify(mockFeatureFlags), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        if (url.includes('/rest/v1/quiz_responses')) {
          return new Response(JSON.stringify({}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        if (url.includes('/rest/v1/analytics')) {
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        return originalFetch(input, init);
      };

      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: (key: string) => {
            if (key === 'user') {
              return JSON.stringify({
                id: '550e8400-e29b-41d4-a716-446655440000',
                username: 'jc',
                password: 'abc123'
              });
            }
            return null;
          },
          setItem: () => {},
          removeItem: () => {},
          clear: () => {}
        },
        writable: true
      });
    });
  }

  static async completeWelcomeFlow(page: Page) {
    await page.waitForSelector('.continue-button', { timeout: 5000 });
    await page.click('.continue-button');
    await page.waitForURL('/goal', { timeout: 5000 });
  }

  static async completeGoalSetup(page: Page) {
    await page.waitForSelector('.continue-button', { timeout: 5000 });
    await page.click('.continue-button');
    await page.waitForURL('/quiz', { timeout: 5000 });
  }

  static async completeQuiz(page: Page) {
    let questionCount = 0;
    const maxQuestions = 3;

    while (questionCount < maxQuestions) {
      questionCount++;
      console.log(`Answering question ${questionCount}`);

      await page.waitForSelector('.option-card', { timeout: 5000 });
      const options = page.locator('.option-card');
      await options.first().click();
      console.log(`Clicked option for question ${questionCount}`);

      await page.waitForTimeout(1000);

      const completeButton = page.locator('button:has-text("Complete")');
      const buttonExists = await completeButton.count() > 0;

      if (buttonExists) {
        console.log('Found Complete button!');

        const isDisabled = await completeButton.getAttribute('disabled') !== null;
        console.log(`Complete button disabled: ${isDisabled}`);

        if (!isDisabled) {
          console.log('Complete button is enabled, clicking it');
          await page.click('button:has-text("Complete")');
          break;
        } else {
          console.log('Complete button is still disabled, waiting longer...');
          await page.waitForTimeout(2000);
          await page.click('button:has-text("Complete")', { force: true });
          break;
        }
      } else {
        console.log('Complete button not found, looking for Next button');
        const nextButton = page.locator('button:has-text("Next")');
        const nextExists = await nextButton.count() > 0;

        if (nextExists) {
          console.log('Found Next button, clicking it');
          await page.click('button:has-text("Next")');
        } else {
          console.log('No Next button found, waiting for auto-advance');
        }

        await page.waitForTimeout(2000);
      }
    }

    if (questionCount >= maxQuestions) {
      throw new Error('Could not complete quiz - too many questions or stuck in loop');
    }

    await page.waitForURL('/summary', { timeout: 5000 });
  }

  static async completeSummary(page: Page) {
    await page.waitForSelector('.start-journey-button', { timeout: 5000 });
    await page.click('.start-journey-button');
    await page.waitForURL('/payment', { timeout: 5000 });
  }

  static async completePayment(page: Page) {
    await page.waitForSelector('.stripe-button', { timeout: 5000 });

    let alertMessage = '';
    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      console.log('Alert message:', alertMessage);
      await dialog.accept();
    });

    await page.click('.stripe-button');

    await page.waitForTimeout(1000);

    if (alertMessage !== 'Payment logic here') {
      throw new Error(`Expected alert message "Payment logic here" but got "${alertMessage}"`);
    }

    console.log('Payment alert handled successfully');
  }
}


