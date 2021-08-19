import { test as base } from '@playwright/test';
import { InspectPage } from './models/Inspect';

type TestFixtures = {
  inspectPage: InspectPage;
};

export const test = base.extend<TestFixtures>({
  inspectPage: async ({ page }, use) => {
    const inspectPage = new InspectPage(page);
    await inspectPage.goto();
    await use(inspectPage);
  },
});
