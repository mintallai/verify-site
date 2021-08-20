import { expect } from '@playwright/test';
import { test } from './test';

test.describe('Inspect page - base functionality', () => {
  test('drag and drop appears on load', async ({ inspectPage }) => {
    const locator = inspectPage.page.locator('data-test-id=viewer.upload');
    await expect(locator).toContainText('Drag and drop your file');
  });

  test('image thumbnail loads correctly', async ({ inspectPage }) => {
    await inspectPage.uploadImage('CAICAI.jpg');
    const elementHandle = await inspectPage.getThumbnailElement();
    expect(await elementHandle.screenshot()).toMatchSnapshot(
      'CAICAI-viewer-thumbnail.png',
    );
  });

  test('content credentials section is shown properly after upload', async ({
    inspectPage,
  }) => {
    const { page } = inspectPage;
    const section = page.locator('data-test-id=contentCredentials.section');
    await inspectPage.uploadImage('CAICAI.jpg');
    await expect(await section.screenshot()).toMatchSnapshot(
      'CAICAI-content-credentials-section.png',
    );
  });

  test('content credentials section shows the correct assets', async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage('CAICAI.jpg');
    await expect(await inspectPage.assetLocator().count()).toEqual(3);
    await expect(await inspectPage.assetLocator(0)).toContainText('CAICAI.jpg');
    await expect(await inspectPage.assetLocator(0)).not.toHaveClass(/indented/);
    await expect(await inspectPage.assetLocator(1)).toContainText('CA.jpg');
    await expect(await inspectPage.assetLocator(1)).toHaveClass(/indented/);
    await expect(await inspectPage.assetLocator(2)).toContainText('CAI.jpg');
    await expect(await inspectPage.assetLocator(2)).toHaveClass(/indented/);
  });

  test('content credentials assets have proper badging', async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage('CAICAI.jpg');
    const expectedHelpText = 'This image has attribution and history data.';
    const first = inspectPage.assetLocator(0);
    await expect(await first.locator('cai-icon-info').count()).toEqual(1);
    await expect(await first.locator('cai-tooltip')).toContainText(
      expectedHelpText,
    );
    const second = inspectPage.assetLocator(1);
    await expect(await second.locator('cai-icon-info').count()).toEqual(1);
    await expect(await second.locator('cai-tooltip')).toContainText(
      expectedHelpText,
    );
    const third = inspectPage.assetLocator(2);
    await expect(await third.locator('cai-icon-info').count()).toEqual(1);
    await expect(await third.locator('cai-tooltip')).toContainText(
      expectedHelpText,
    );
  });
});
