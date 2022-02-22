// ADOBE CONFIDENTIAL
// Copyright 2021 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

import { Page } from '@playwright/test';
import { resolve } from 'path';
import { testID } from '../utils/selectors';

const imageBase = resolve(__dirname, '../assets/images');

export class InspectPage {
  readonly page: Page;

  static ABOUT_SEL = '[data-test-id="about"]';
  static THUMBNAIL_SEL = '[data-test-id="viewer.thumbnail"][src^="blob:"]';

  constructor(page: Page) {
    this.page = page;
  }

  async goto(query?: string) {
    await this.page.goto(query ? `/inspect?${query}` : '/inspect');
  }

  getAboutComponent() {
    return this.page.waitForSelector(InspectPage.ABOUT_SEL);
  }

  getThumbnailElement() {
    return this.page.waitForSelector(InspectPage.THUMBNAIL_SEL);
  }

  rightColumn() {
    return this.page.locator(testID('inspect.right-col'));
  }

  languagePicker() {
    return this.page.locator(testID('footer.language-picker'));
  }

  async changeLanguageViaPicker(lang: string) {
    const picker = this.languagePicker();
    const option = this.page.locator(testID(`footer.language-option-${lang}`));
    await picker.click();
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  nodeLocator(index?: string) {
    if (index) {
      return this.page.locator(`div[data-node-idx="${index}"]`);
    }
    return this.page.locator('div[data-node-idx]');
  }

  async uploadImage(imageRelPath: string) {
    await this.goto();
    await this.page.setInputFiles(
      'data-test-id=viewer.fileInput',
      resolve(imageBase, imageRelPath),
    );
    await this.getThumbnailElement();
  }
}
