import type { Page } from '@playwright/test';
import { resolve } from 'path';

export class InspectPage {
  readonly page: Page;

  static THUMBNAIL_SELECTOR = '[data-test-id="viewer.thumbnail"][src^="blob:"]';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/inspect');
  }

  async getThumbnailElement() {
    return this.page.waitForSelector(InspectPage.THUMBNAIL_SELECTOR);
  }

  assetLocator(index = -1) {
    const locator = this.page.locator('data-test-id=asset.container');
    if (index >= 0) {
      return locator.nth(index);
    }
    return locator;
  }

  async uploadImage(imageFilename: string) {
    await this.goto();
    await this.page.setInputFiles(
      'data-test-id=viewer.fileInput',
      resolve(__dirname, '../images', imageFilename),
    );
    // Ingredients/badges seem to be displayed on the next render cycle after
    // the initial thumbnail element
    await this.page.waitForSelector(
      'data-test-id=contentCredentials.ingredients',
    );
  }
}
