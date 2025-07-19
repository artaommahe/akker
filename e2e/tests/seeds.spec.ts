import test, { expect } from 'playwright/test';

test.describe('seeds', () => {
  test('should allow to add new seeds from the home page', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Add seeds' }).click();

    await expect(page.getByRole('heading', { name: 'Add seeds' })).toBeVisible();

    await page.getByRole('textbox', { name: 'New seeds list' }).fill(seedsList);
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByRole('list', { name: 'Last seeds list' }).getByRole('listitem')).toHaveText([
      'ondraaglijk4',
      'beschermen1',
      'verwarren3',
    ]);
  });

  test('should allow to add new seeds from the seeds page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Seeds' }).click();

    await page.getByRole('button', { name: 'Add seeds' }).click();
    await page.getByRole('textbox', { name: 'New seeds list' }).fill(seedsList);
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByRole('list', { name: 'Top seeds list' }).getByRole('listitem')).toHaveText([
      'ondraaglijk4',
      'verwarren3',
      'beschermen1',
    ]);
    await expect(page.getByRole('list', { name: 'Last seeds list' }).getByRole('listitem')).toHaveText([
      'ondraaglijk4',
      'beschermen1',
      'verwarren3',
    ]);

    await page.getByRole('group').filter({ hasText: 'All seeds (3)' }).click();

    await expect(page.getByRole('group').filter({ hasText: 'All seeds (3)' }).getByRole('listitem')).toHaveText([
      'ondraaglijk4',
      'verwarren3',
      'beschermen1',
    ]);
  });

  // group tests that use the demo data
  test.describe('', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: 'Load demo data' }).click();
    });

    test('should show seed details when clicking on a seed in any list', async ({ page }) => {
      await page.getByRole('list', { name: 'Last seeds list' }).getByRole('button', { name: 'snoep' }).click();

      await expect(page.getByRole('heading', { name: 'Seed details' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('snoep');

      await page.getByRole('button', { name: 'Cancel' }).click();
      await page.getByRole('link', { name: 'Seeds' }).click();

      await page.getByRole('list', { name: 'Top seeds list' }).getByRole('button', { name: 'snoep' }).click();

      await expect(page.getByRole('heading', { name: 'Seed details' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('snoep');

      await page.getByRole('button', { name: 'Cancel' }).click();
      await page.getByRole('list', { name: 'Last seeds list' }).getByRole('button', { name: 'snoep' }).click();

      await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('snoep');

      await page.getByRole('button', { name: 'Cancel' }).click();
      await page.getByRole('group').filter({ hasText: 'All seeds' }).click();
      await page.getByRole('group').filter({ hasText: 'All seeds' }).getByRole('button', { name: 'snoep' }).click();

      await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('snoep');
    });

    test('should show seed details on the home page', async ({ page }) => {
      await page.getByRole('list', { name: 'Last seeds list' }).getByRole('button', { name: 'snoep' }).click();

      await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('snoep');
    });

    test('should show last added seed at the top of the list', async ({ page }) => {
      await page.getByRole('button', { name: 'Add seeds' }).click();
      await page.getByRole('textbox', { name: 'New seeds list' }).fill('dak');
      await page.getByRole('button', { name: 'Add', exact: true }).click();

      await expect(page.getByRole('list', { name: 'Last seeds list' }).getByRole('listitem').first()).toHaveText(
        'dak1',
      );

      await page.getByRole('link', { name: 'Seeds' }).click();

      await expect(page.getByRole('list', { name: 'Last seeds list' }).getByRole('listitem').first()).toHaveText(
        'dak1',
      );
    });

    test('should increase seeds count when adding existing seeds', async ({ page }) => {
      await page.getByRole('button', { name: 'Add seeds' }).click();
      await page.getByRole('textbox', { name: 'New seeds list' }).fill(['snoep', 'spel'].join('\n'));
      await page.getByRole('button', { name: 'Add', exact: true }).click();

      const lastSeedsList = page.getByRole('list', { name: 'Last seeds list' }).getByRole('listitem');

      await expect(lastSeedsList.first()).toHaveText('spel2');
      await expect(lastSeedsList.nth(1)).toHaveText('snoep3');
    });

    test('should allow to add a seed with the same name as an existing card', async ({ page }) => {
      await page.getByRole('button', { name: 'Add seeds' }).click();
      await page.getByRole('textbox', { name: 'New seeds list' }).fill(['aarde', 'aarde', 'aarde'].join('\n'));
      await page.getByRole('button', { name: 'Add', exact: true }).click();

      await expect(page.getByRole('list', { name: 'Last seeds list' }).getByRole('listitem').first()).toHaveText(
        'aarde3',
      );
    });

    test('should allow to edit a seed', async ({ page }) => {
      await page.getByRole('list', { name: 'Last seeds list' }).getByRole('button', { name: 'doel' }).click();
      await page.getByRole('textbox', { name: 'Name' }).fill('lucht');
      await page.getByRole('button', { name: 'Save' }).click();

      await expect(page.getByText('doel')).not.toBeVisible();
      await expect(page.getByRole('button', { name: 'lucht' })).toBeVisible();

      await page.getByRole('link', { name: 'Seeds' }).click();
      await page.getByRole('group').filter({ hasText: 'All seeds' }).click();

      await expect(page.getByText('doel')).not.toBeVisible();
      await expect(page.getByRole('button', { name: 'lucht' })).toHaveCount(3);
    });

    test('should allow to remove a seed', async ({ page }) => {
      await page.getByRole('list', { name: 'Last seeds list' }).getByRole('button', { name: 'snoep' }).click();
      await page.getByRole('button', { name: 'Remove' }).click();

      await expect(page.getByText('snoep')).not.toBeVisible();

      await page.getByRole('link', { name: 'Seeds' }).click();
      await page.getByRole('group').filter({ hasText: 'All seeds' }).click();

      await expect(page.getByText('snoep')).not.toBeVisible();
    });
  });
});

const seedsList = `
  verwarren
  beschermen
  ondraaglijk
  verwarren

  verwarren
  ondraaglijk
  ondraaglijk

  ondraaglijk
`;
