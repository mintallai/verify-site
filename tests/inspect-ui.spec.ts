import { expect } from '@playwright/test';
import filenamify from 'filenamify';
import { test } from './test';
import imageIndex from './assets/data/index.json';

/*
for (const testImage of imageIndex) {
  test(`User interface - test image › ${testImage}`, async () => {
    const filename = filenamify(testImage);

    test('image thumbnail and navigation render correctly', async ({
      inspectPage,
    }) => {
      const { page } = inspectPage;
      await inspectPage.uploadImage(testImage);
      const elementHandle = await inspectPage.getThumbnailElement();
      const hierarchy = page.locator('data-test-id=navigation.hierarchy');
      const rightCol = page.locator('data-test-id=inspect.right-col');
      await expect(await elementHandle.screenshot()).toMatchSnapshot(
        `${filename}-viewer-thumbnail.png`,
      );
      await expect(await hierarchy.screenshot()).toMatchSnapshot(
        `${filename}-hierarchy.png`,
      );
      await expect(await rightCol.screenshot()).toMatchSnapshot(
        `${filename}-right-col.png`,
      );
    });
  });
}
*/
