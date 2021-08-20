import { test } from './test';
import { injectAxe, checkA11y, Options as AxeOptions } from 'axe-playwright';

test.describe('Inspect page - accessibility check', () => {
  const config: AxeOptions = {
    detailedReport: true,
    detailedReportOptions: { html: true },
    axeOptions: {},
  };

  test('the upload screen passes accessibility checks', async ({ page }) => {
    await page.goto('/inspect');
    await injectAxe(page);
    await checkA11y(page, null, config);
  });

  test('accessibility checks still pass after you upload an image', async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage('CAICAI.jpg');
    await injectAxe(inspectPage.page);
    await checkA11y(inspectPage.page, null, config);
  });
});
