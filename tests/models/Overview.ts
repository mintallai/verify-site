import type { Page } from '@playwright/test';
import { resolve } from 'path';
import { testID } from '../utils/selectors';

const imageBase = resolve(__dirname, '../assets/images');
const defaultImage = 'CAICAI.jpg';

export class OverviewPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(query?: string) {
    await this.page.goto(`/overview?${query}`);
  }

  rightColumn() {
    return this.page.locator(testID('overview.right-col'));
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
    await this.page.waitForSelector(testID('tree-view'));
  }
}
