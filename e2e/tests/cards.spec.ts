import test, { expect } from 'playwright/test';

test.describe('cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // TODO: set initial state without relying on demo data feature
    await page.getByRole('button', { name: 'Load demo data' }).click();
  });

  test('should show unsorted cards list at home page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Unsorted cards (3)' })).toBeVisible();
    await expect(page.getByRole('list', { name: 'Unsorted cards' }).getByRole('listitem')).toHaveText([
      'aardbei',
      'arbeid',
      'bliksem',
    ]);
  });

  test('should show last cards list at home page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Last cards' })).toBeVisible();
    await expect(page.getByRole('list', { name: 'Last cards' }).getByRole('listitem')).toHaveText([
      'framboos',
      'tijdschrift',
      'servet',
      'leraar',
      'voorkomen',
      'postkantoor',
      'aarde',
      'boom',
      'wolk',
      'bliksem',
    ]);
  });

  test('should show cards list at cards page', async ({ page }) => {
    await page.getByRole('link', { name: 'Cards' }).click();

    await expect(page.getByRole('heading', { name: 'New cards' })).toBeVisible();
    await expect(page.getByRole('list', { name: 'New cards' }).getByRole('listitem')).toHaveText([
      'framboos',
      'tijdschrift',
      'servet',
      'leraar',
      'voorkomen',
      'postkantoor',
      'aarde',
      'boom',
      'wolk',
      'bliksem',
    ]);

    await page.getByRole('group').filter({ hasText: 'Rest (2)' }).click();

    await expect(page.getByRole('group').filter({ hasText: 'Rest (2)' }).getByRole('listitem')).toHaveText([
      'arbeid',
      'aardbei',
    ]);
  });

  test('should show unsorted card details', async ({ page }) => {
    await page.getByRole('list', { name: 'Unsorted cards' }).getByRole('button', { name: 'bliksem' }).click();

    await expect(page.getByRole('heading', { name: 'Card details' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Term', exact: true })).toHaveValue('bliksem');
    await expect(page.getByRole('textbox', { name: 'Full term' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Definition' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Tags' })).toHaveValue('');

    await page.getByRole('group').filter({ hasText: 'FSRS stats' }).click();

    await expect(page.getByRole('group').filter({ hasText: 'FSRS stats' }).getByRole('list')).toHaveText('empty');
  });

  test('should show last card details at home page', async ({ page }) => {
    await page.getByRole('list', { name: 'Last cards' }).getByRole('button', { name: 'postkantoor' }).click();

    await expect(page.getByRole('heading', { name: 'Card details' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Term', exact: true })).toHaveValue('postkantoor');
    await expect(page.getByRole('textbox', { name: 'Full term' })).toHaveValue('p**o**stkantoor');
    await expect(page.getByRole('textbox', { name: 'Definition' })).toHaveValue('post office');
    await expect(page.getByRole('textbox', { name: 'Tags' })).toHaveValue('nl, top1k');

    await page.getByRole('group').filter({ hasText: 'FSRS stats' }).click();

    await expect(page.getByRole('group').filter({ hasText: 'FSRS stats' }).getByRole('list')).toHaveText('empty');
  });

  test('should show last card details at cards page', async ({ page }) => {
    await page.getByRole('link', { name: 'Cards' }).click();
    await page.getByRole('list', { name: 'New cards' }).getByRole('button', { name: 'framboos' }).click();

    await expect(page.getByRole('heading', { name: 'Card details' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Term', exact: true })).toHaveValue('framboos');
    await expect(page.getByRole('textbox', { name: 'Full term' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Definition' })).toHaveValue('raspberry');
    await expect(page.getByRole('textbox', { name: 'Tags' })).toHaveValue('');

    await page.getByRole('group').filter({ hasText: 'FSRS stats' }).click();

    await expect(page.getByRole('group').filter({ hasText: 'FSRS stats' }).getByRole('list')).toHaveText('empty');
  });

  test('should convert a seed to a card on treshold exceed', async ({ page }) => {
    await page.getByRole('button', { name: 'Add seeds' }).click();
    await page.getByRole('textbox', { name: 'New seeds' }).fill(['kat', 'snoep', 'snoep', 'snoep', 'snoep'].join('\n'));
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByRole('list', { name: 'Unsorted cards' }).getByRole('listitem')).toHaveCount(5);
    await expect(page.getByRole('list', { name: 'Last seeds' }).getByRole('listitem')).toHaveCount(4);
    await expect(
      page
        .getByRole('list', { name: 'Last cards' })
        .getByRole('listitem')
        .filter({ hasText: /kat|snoep/ }),
    ).toHaveCount(2);

    const lastCards = page.getByRole('list', { name: 'Last cards' }).getByRole('listitem');
    await expect(lastCards.first()).toHaveText('snoep');
    await expect(lastCards.nth(1)).toHaveText('kat');

    await page.getByRole('link', { name: 'Seeds' }).click();
    await page.getByRole('group').filter({ hasText: 'All seeds' }).click();

    await expect(page.getByText('kat')).not.toBeVisible();
    await expect(page.getByText('snoep')).not.toBeVisible();
  });

  test('should add multiple cards from an add cards dialog', async ({ page }) => {
    await page.getByRole('link', { name: 'Cards' }).click();
    await page.getByRole('button', { name: 'Add cards' }).click();

    await expect(page.getByRole('heading', { name: 'Add cards' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'New cards' })).toBeVisible();

    await page
      .getByRole('textbox', { name: 'New cards' })
      .fill(
        [
          'ziekenhuis; z**ie**kenhuis; hospital; nl, top1k',
          'mier;; ant; nl, top1k',
          'identiteit',
          'razend; r**a**zend;;nl',
        ].join('\n'),
      );
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    const lastCards = page.getByRole('list', { name: 'New cards' }).getByRole('listitem');
    await expect(lastCards.first()).toHaveText('razend');
    await expect(lastCards.nth(1)).toHaveText('identiteit');
    await expect(lastCards.nth(2)).toHaveText('mier');
    await expect(lastCards.nth(3)).toHaveText('ziekenhuis');

    // check that all fields are filled correctly for different cases
    await page.getByRole('button', { name: 'ziekenhuis' }).click();

    await expect(page.getByRole('textbox', { name: 'Term', exact: true })).toHaveValue('ziekenhuis');
    await expect(page.getByRole('textbox', { name: 'Full term' })).toHaveValue('z**ie**kenhuis');
    await expect(page.getByRole('textbox', { name: 'Definition' })).toHaveValue('hospital');
    await expect(page.getByRole('textbox', { name: 'Tags' })).toHaveValue('nl, top1k');

    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('button', { name: 'mier' }).click();

    await expect(page.getByRole('textbox', { name: 'Term', exact: true })).toHaveValue('mier');
    await expect(page.getByRole('textbox', { name: 'Full term' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Definition' })).toHaveValue('ant');
    await expect(page.getByRole('textbox', { name: 'Tags' })).toHaveValue('nl, top1k');

    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('button', { name: 'identiteit' }).click();

    await expect(page.getByRole('textbox', { name: 'Term', exact: true })).toHaveValue('identiteit');
    await expect(page.getByRole('textbox', { name: 'Full term' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Definition' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Tags' })).toHaveValue('');

    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('button', { name: 'razend' }).click();

    await expect(page.getByRole('textbox', { name: 'Term', exact: true })).toHaveValue('razend');
    await expect(page.getByRole('textbox', { name: 'Full term' })).toHaveValue('r**a**zend');
    await expect(page.getByRole('textbox', { name: 'Definition' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Tags' })).toHaveValue('nl');
  });

  test('should allow to edit a card', async ({ page }) => {
    await page.getByRole('list', { name: 'Last cards' }).getByRole('button', { name: 'leraar' }).click();
    await page.getByRole('textbox', { name: 'Term', exact: true }).fill('docent');
    await page.getByRole('textbox', { name: 'Full term' }).fill('doc**e**nt');
    await page.getByRole('textbox', { name: 'Definition' }).fill('lecturer');
    await page.getByRole('textbox', { name: 'Tags' }).fill('nl, top2k');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('leraar')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'docent' })).toBeVisible();

    await page.getByRole('list', { name: 'Last cards' }).getByRole('button', { name: 'docent' }).click();
    await expect(page.getByRole('heading', { name: 'Card details' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Term', exact: true })).toHaveValue('docent');
    await expect(page.getByRole('textbox', { name: 'Full term' })).toHaveValue('doc**e**nt');
    await expect(page.getByRole('textbox', { name: 'Definition' })).toHaveValue('lecturer');
    await expect(page.getByRole('textbox', { name: 'Tags' })).toHaveValue('nl, top2k');

    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.getByRole('link', { name: 'Cards' }).click();
    await page.getByRole('group').filter({ hasText: 'Rest (2)' }).click();

    await expect(page.getByText('leraar')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'docent' })).toBeVisible();
  });

  test('should remove unsorted card from the list on card definition change', async ({ page }) => {
    await page.getByRole('list', { name: 'Unsorted cards' }).getByRole('button', { name: 'arbeid' }).click();
    await page.getByRole('textbox', { name: 'Definition' }).fill('work');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('heading', { name: 'Unsorted cards (2)' })).toBeVisible();
    await expect(page.getByRole('list', { name: 'Unsorted cards' }).getByRole('listitem')).toHaveText([
      'aardbei',
      'bliksem',
    ]);
  });

  test('should allow to delete a card', async ({ page }) => {
    await page.getByRole('list', { name: 'Unsorted cards' }).getByRole('button', { name: 'aardbei' }).click();
    await page.getByRole('button', { name: 'Remove' }).click();

    await expect(page.getByRole('heading', { name: 'Unsorted cards (2)' })).toBeVisible();
    await expect(page.getByText('aardbei')).not.toBeVisible();

    await page.getByRole('link', { name: 'Cards' }).click();
    await page.getByRole('group').filter({ hasText: 'Rest (1)' }).click();

    await expect(page.getByText('aardbei')).not.toBeVisible();
  });

  test.describe('search cards', () => {
    test('should show search results for a term', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Search cards' }).fill('oo');

      await expect(page.getByRole('list', { name: 'Search cards list' }).getByRole('listitem')).toHaveText([
        'framboos',
        'voorkomen',
        'postkantoor',
        'boom',
      ]);
    });

    test('should update search results on term change', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Search cards' }).fill('oo');

      await expect(page.getByRole('list', { name: 'Search cards list' })).toBeVisible();

      await page.getByRole('textbox', { name: 'Search cards' }).fill('oor');

      await expect(page.getByRole('list', { name: 'Search cards list' }).getByRole('listitem')).toHaveText([
        'voorkomen',
        'postkantoor',
      ]);
    });

    test('should allow to search by tags', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Search cards' }).fill('tags:top1k');

      await expect(page.getByRole('list', { name: 'Search cards list' }).getByRole('listitem')).toHaveText([
        'servet',
        'leraar',
        'postkantoor',
      ]);

      // multiple tags should work too
      await page.getByRole('textbox', { name: 'Search cards' }).fill('tags:nl,top1k');

      await expect(page.getByRole('list', { name: 'Search cards list' }).getByRole('listitem')).toHaveText([
        'servet',
        'leraar',
        'voorkomen',
        'postkantoor',
      ]);
    });

    test('should allow to search by everything at once', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Search cards' }).fill('tags:nl,top1k oor');

      await expect(page.getByRole('list', { name: 'Search cards list' }).getByRole('listitem')).toHaveText([
        'voorkomen',
        'postkantoor',
      ]);
    });

    test('should show card details from search results', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Search cards' }).fill('oor');
      await page.getByRole('list', { name: 'Search cards list' }).getByRole('button', { name: 'voorkomen' }).click();

      await expect(page.getByRole('heading', { name: 'Card details' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Term', exact: true })).toHaveValue('voorkomen');
    });

    test('should show a message when no results found', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Search cards' }).fill('nonexistentterm');

      await expect(page.getByText('No results found')).toBeVisible();
    });
  });
});
