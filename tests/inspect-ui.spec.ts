import { expect } from '@playwright/test';
import filenamify from 'filenamify';
import { test } from './test';
import imageIndex from './assets/data/index.json';

for (const testImage of imageIndex) {
  test.describe(`User interface - test image › ${testImage}`, async () => {
    const filename = filenamify(testImage);

    test('image thumbnail and navigation render correctly', async ({
      inspectPage,
    }) => {
      const { page } = inspectPage;
      await inspectPage.uploadImage(testImage);
      const elementHandle = await inspectPage.getThumbnailElement();
      const section = page.locator('data-test-id=navigation.hierarchy');
      await expect(await elementHandle.screenshot()).toMatchSnapshot(
        `${filename}-viewer-thumbnail.png`,
      );
      await expect(await section.screenshot()).toMatchSnapshot(
        `${filename}-hierarchy.png`,
      );
    });
  });
}
