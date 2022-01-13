import { expect } from '@playwright/test';
import { test } from './test';

test.describe('Base functionality', () => {
  test('site loads', async ({ page }) => {
    await page.goto('/inspect');
    const title = page.locator('data-test-id=header.app-name');
    await expect(title).toHaveText('Verify');
  });
});
