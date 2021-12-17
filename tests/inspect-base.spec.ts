import { expect } from '@playwright/test';
import { test } from './test';

test.describe('Inspect page - base functionality', () => {
  test('drag and drop appears on load', async ({ inspectPage }) => {
    const locator = inspectPage.page.locator('data-test-id=viewer.upload');
    await expect(locator).toContainText('Drag and drop your file');
  });
});
