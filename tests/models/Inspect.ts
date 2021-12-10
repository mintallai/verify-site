import type { Page } from '@playwright/test';
import { resolve } from 'path';

const imageBase = resolve(__dirname, '../assets/images');
const defaultImage = 'CAICAI.jpg';

export class InspectPage {
  readonly page: Page;

  static ABOUT_SEL = '[data-test-id="about"]';
  static THUMBNAIL_SEL = '[data-test-id="viewer.thumbnail"][src^="blob:"]';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/inspect');
  }

  async getAboutComponent() {
    return this.page.waitForSelector(InspectPage.ABOUT_SEL);
  }

  async getThumbnailElement() {
    return this.page.waitForSelector(InspectPage.THUMBNAIL_SEL);
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
    await this.getAboutComponent();
  }
}
