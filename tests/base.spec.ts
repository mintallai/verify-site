import { test, expect } from '@playwright/test';
import { InspectPage } from './models/Inspect';

test('site loads', async ({ page }) => {
  await page.goto('/inspect');
  const title = page.locator('data-test-id=app.name');
  await expect(title).toHaveText('Verify');
});

test('image thumbnail loads correctly', async ({ page }) => {
  const inspect = new InspectPage(page);
  await inspect.uploadImage('CAICAI.jpg');
  const elementHandle = await inspect.getThumbnailElement();
  expect(await elementHandle.screenshot()).toMatchSnapshot('CAICAI.png');
});
