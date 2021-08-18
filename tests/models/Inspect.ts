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

  async uploadImage(imageFilename: string) {
    await this.goto();
    await this.page.setInputFiles(
      'data-test-id=viewer.fileInput',
      resolve(__dirname, '../images', imageFilename),
    );
    await this.getThumbnailElement();
  }
}
