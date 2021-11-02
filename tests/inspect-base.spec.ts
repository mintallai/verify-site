import { expect } from '@playwright/test';
import { test } from './test';

test.describe('Inspect page - base functionality', () => {
  test('drag and drop appears on load', async ({ inspectPage }) => {
    const locator = inspectPage.page.locator('data-test-id=viewer.upload');
    await expect(locator).toContainText('Drag and drop your file');
  });

  test('content credentials section shows the correct assets', async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage();
    await expect(await inspectPage.nodeLocator().count()).toEqual(6);
    await expect(await inspectPage.nodeLocator('0')).toContainText(
      'CAICAI.jpg',
    );
    await expect(await inspectPage.nodeLocator('0.0')).toContainText('CA.jpg');
    await expect(await inspectPage.nodeLocator('0.0.0')).toContainText('A.jpg');
    await expect(await inspectPage.nodeLocator('0.1')).toContainText('CAI.jpg');
    await expect(await inspectPage.nodeLocator('0.1.0')).toContainText('A.jpg');
    await expect(await inspectPage.nodeLocator('0.1.1')).toContainText('I.jpg');
  });

  test('content credentials assets have proper badging', async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage();
    const expectedHelpText = 'This file has content credentials';
    const first = inspectPage.nodeLocator('0');
    await expect(await first.locator('cai-icon-info').count()).toEqual(1);
    await expect(await first.locator('cai-tooltip')).toContainText(
      expectedHelpText,
    );
    const second = inspectPage.nodeLocator('0.0');
    await expect(await second.locator('cai-icon-info').count()).toEqual(1);
    await expect(await second.locator('cai-tooltip')).toContainText(
      expectedHelpText,
    );
    const third = inspectPage.nodeLocator('0.0.0');
    await expect(await third.locator('cai-icon-info').count()).toEqual(0);
  });
});
