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

import { expect } from '@playwright/test';
import { test } from './test';
import translations from '../locales/en-US.json';

const REVIEW_ALERT_SEL = 'data-test-id=about.unknownActionsAlert';

// @TODO: re-enable or move these
test.skip('Image reviews', () => {
  test(`a file with no reviews doesn't show an alert`, async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage('CAICAI.jpg');
    const locator = inspectPage.page.locator(REVIEW_ALERT_SEL);
    expect(await locator.count()).toEqual(0);
  });

  test(`a file with a smart object should show an alert`, async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage('smart-object.jpg');
    const locator = inspectPage.page.locator(REVIEW_ALERT_SEL);
    expect(await locator.count()).toEqual(1);
    await expect(locator).toContainText(
      translations['comp.contentCredentialsError.unknownActions'],
    );
  });

  test(`a file that had a script run should show an alert`, async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage('script.jpg');
    const locator = inspectPage.page.locator(REVIEW_ALERT_SEL);
    expect(await locator.count()).toEqual(1);
    await expect(locator).toContainText(
      translations['comp.contentCredentialsError.unknownActions'],
    );
  });

  test(`a file that has a smart object and a script run should show an alert`, async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage('smart-object-script.jpg');
    const locator = inspectPage.page.locator(REVIEW_ALERT_SEL);
    expect(await locator.count()).toEqual(1);
    await expect(locator).toContainText(
      translations['comp.contentCredentialsError.unknownActions'],
    );
  });
});
