import { test } from './test';
import { injectAxe, checkA11y, Options as AxeOptions } from 'axe-playwright';

test.describe('Inspect page - accessibility check', () => {
  const config: AxeOptions = {
    detailedReport: true,
    detailedReportOptions: { html: true },
    axeOptions: {},
  };

  test.skip('the upload screen passes accessibility checks', async ({
    page,
  }) => {
    await page.goto('/inspect');
    await injectAxe(page);
    await checkA11y(page, null, config);
  });

  test.skip('accessibility checks still pass after you upload an image', async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage();
    await injectAxe(inspectPage.page);
    await checkA11y(inspectPage.page, null, config);
  });
});
