// ADOBE CONFIDENTIAL
// Copyright 2021 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

import { test } from './test';
import { injectAxe, checkA11y } from 'axe-playwright';
import type { AxeOptions } from 'axe-playwright/dist/types';

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
    await inspectPage.uploadImage('CAICAI.jpg');
    await injectAxe(inspectPage.page);
    await checkA11y(inspectPage.page, null, config);
  });
});
