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

import { test as base } from '@playwright/test';
import { OverviewPage } from './models/Overview.js';
import { InspectPage } from './models/Inspect.js';

interface TestFixtures {
  inspectPage: InspectPage;
  overviewPage: OverviewPage;
}

export const test = base.extend<TestFixtures>({
  inspectPage: async ({ page }, use) => {
    const inspectPage = new InspectPage(page);
    await inspectPage.goto();
    await use(inspectPage);
  },

  overviewPage: async ({ page }, use) => {
    const overviewPage = new OverviewPage(page);
    await overviewPage.goto();
    await use(overviewPage);
  },
});
