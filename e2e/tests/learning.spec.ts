import test, { expect } from 'playwright/test';

test.describe('learning', () => {
  test('shouldnt show learn cards button if there are no cards', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Learn' })).toHaveCount(0);

    await page.goto('/cards');

    await expect(page.getByRole('button', { name: 'Learn' })).toHaveCount(0);
  });

  // group tests that use the demo data
  test.describe('', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      // TODO: set initial state without relying on demo data feature
      await page.getByRole('button', { name: 'Load demo data' }).click();
    });

    test('should show learn cards button on home and cards pages', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Learn' })).toHaveCount(1);

      await page.goto('/cards');

      await expect(page.getByRole('button', { name: 'Learn' })).toHaveCount(1);
    });

    // NOTE: can't check for a specific term present cause the order of cards is randomized
    test('should open learn cards dialog on learn cards button click', async ({ page }) => {
      await page.getByRole('button', { name: 'Learn' }).click();

      await expect(page.getByText('to go (12)')).toBeVisible();
      await expect(page.getByText('to repeat (0)')).toBeVisible();
      await expect(page.getByText('learning (0)')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Good' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Easy' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Hard' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Again' })).toBeVisible();
    });

    test('should show allow to rate cards', async ({ page }) => {
      await page.getByRole('button', { name: 'Learn' }).click();

      await page.getByRole('button', { name: 'Easy' }).click();

      await expect(page.getByText('to go (11)')).toBeVisible();
      await expect(page.getByText('to repeat (0)')).toBeVisible();
      await expect(page.getByText('learning (1)')).toBeVisible();

      await page.getByRole('button', { name: 'Good', exact: true }).click();

      await expect(page.getByText('to go (10)')).toBeVisible();
      await expect(page.getByText('to repeat (0)')).toBeVisible();
      await expect(page.getByText('learning (2)')).toBeVisible();

      await page.getByRole('button', { name: 'Hard' }).click();

      await expect(page.getByText('to go (9)')).toBeVisible();
      await expect(page.getByText('to repeat (0)')).toBeVisible();
      await expect(page.getByText('learning (3)')).toBeVisible();

      await page.getByRole('button', { name: 'Again' }).click();

      await expect(page.getByText('to go (8)')).toBeVisible();
      await expect(page.getByText('to repeat (1)')).toBeVisible();
      await expect(page.getByText('learning (3)')).toBeVisible();

      await page.getByRole('button', { name: 'Easy' }).click();
      await page.getByRole('button', { name: 'Easy' }).click();
      await page.getByRole('button', { name: 'Easy' }).click();
      await page.getByRole('button', { name: 'Easy' }).click();
      await page.getByRole('button', { name: 'Easy' }).click();
      await page.getByRole('button', { name: 'Easy' }).click();
      await page.getByRole('button', { name: 'Easy' }).click();
      await page.getByRole('button', { name: 'Easy' }).click();

      await expect(page.getByText('to go (0)')).toBeVisible();
      await expect(page.getByText('to repeat (1)')).toBeVisible();
      await expect(page.getByText('learning (11)')).toBeVisible();

      await page.getByRole('button', { name: 'Easy' }).click();

      await expect(page.getByText('to go (0)')).toBeVisible();
      await expect(page.getByText('to repeat (0)')).toBeVisible();
      await expect(page.getByText('learning (12)')).toBeVisible();
      await expect(page.getByText('Done!')).toBeVisible();
    });
  });
});
