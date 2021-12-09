import { expect } from '@playwright/test';
import { test } from './test';
import translations from '../locales/en-US.json';

const REVIEW_ALERT_SEL = 'data-test-id=about.unknownActionsAlert';

test.describe.parallel('Image reviews', () => {
  test(`a file with no reviews doesn't show an alert`, async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage('CAICAI.jpg');
    const locator = inspectPage.page.locator(REVIEW_ALERT_SEL);
    await expect(await locator.count()).toEqual(0);
  });

  test(`a file with a smart object should show an alert`, async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage('smart-object.jpg');
    const locator = inspectPage.page.locator(REVIEW_ALERT_SEL);
    await expect(await locator.count()).toEqual(1);
    await expect(locator).toContainText(
      translations['comp.contentCredentialsError.unknownActions'],
    );
  });

  test(`a file that had a script run should show an alert`, async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage('script.jpg');
    const locator = inspectPage.page.locator(REVIEW_ALERT_SEL);
    await expect(await locator.count()).toEqual(1);
    await expect(locator).toContainText(
      translations['comp.contentCredentialsError.unknownActions'],
    );
  });

  test(`a file that has a smart object and a script run should show an alert`, async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage('smart-object-script.jpg');
    const locator = inspectPage.page.locator(REVIEW_ALERT_SEL);
    await expect(await locator.count()).toEqual(1);
    await expect(locator).toContainText(
      translations['comp.contentCredentialsError.unknownActions'],
    );
  });
});
