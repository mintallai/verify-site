import { test as base } from '@playwright/test';
import { OverviewPage } from './models/Overview';
import { InspectPage } from './models/Inspect';

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
