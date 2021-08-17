import { test, expect } from '@playwright/test';

test('site loads', async ({ page }) => {
  await page.goto('/inspect');
  const title = page.locator('data-test-id=app.name');
  await expect(title).toHaveText('Verify');
});
