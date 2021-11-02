import type { Page } from '@playwright/test';
import { resolve } from 'path';

const imageBase = resolve(__dirname, '../assets/data');
const defaultImage = 'tests/CAICAI.jpg';

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

  nodeLocator(index?: string) {
    if (index) {
      return this.page.locator(`div[data-node-idx="${index}"]`);
    }
    return this.page.locator('div[data-node-idx]');
  }

  async uploadImage(imageRelPath: string = defaultImage) {
    await this.goto();
    await this.page.setInputFiles(
      'data-test-id=viewer.fileInput',
      resolve(imageBase, imageRelPath),
    );
    await this.getThumbnailElement();
  }
}
