import { expect } from '@playwright/test';
import { test } from './test';

test.describe('Inspect page - base functionality @only', () => {
  test('drag and drop appears on load', async ({ inspectPage }) => {
    const locator = inspectPage.page.locator('data-test-id=viewer.upload');
    await expect(locator).toContainText('Drag and drop your file');
  });

  test('image thumbnail loads correctly', async ({ inspectPage }) => {
    await inspectPage.uploadImage('CAICAI.jpg');
    const elementHandle = await inspectPage.getThumbnailElement();
    expect(await elementHandle.screenshot()).toMatchSnapshot('CAICAI.png');
  });
});
