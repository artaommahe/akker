import test, { expect } from 'playwright/test';

test.describe('demo data', () => {
  test('should load demo data', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Load demo data' }).click();

    await expect(page.getByRole('heading', { name: 'Unsorted cards (3)' })).toBeVisible();
    await expect(page.getByRole('list', { name: 'Unsorted cards' }).getByRole('listitem')).toHaveCount(3);

    await expect(page.getByRole('list', { name: 'Last cards' }).getByRole('listitem')).toHaveCount(10);

    await expect(page.getByRole('list', { name: 'Last seeds' }).getByRole('listitem')).toHaveCount(6);
  });

  test('load demo data should be available only if there is no data', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Load demo data' }).click();

    await expect(page.getByRole('button', { name: 'Load demo data' })).not.toBeVisible();

    await page.reload();
    await page.getByRole('link', { name: 'Home' }).waitFor();

    await expect(page.getByRole('button', { name: 'Load demo data' })).not.toBeVisible();
  });
});
