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
    await this.page.goto(query ? `/overview?${query}` : '/overview');
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
    await this.page.locator('sp-button', { hasText: 'Overview' }).click();
    await this.page.waitForSelector(testID('tree-view'));
  }
  async navigateToOverview() {
    await this.goto();
  }
}
