import { expect } from '@playwright/test';
import { test } from './test';
import { allImages } from './descriptors';
import { flattenTree } from './utils/tree';
import { aboutHelper } from './helpers/about';

import CAICAI from './descriptors/images/CAICAI';
import CAIECA from './descriptors/images/CAIECA';

test.describe('overview - UI rendering', () => {
  for (const { description, imagePath, claim } of allImages) {
    test(`${description} [${imagePath}]`, async ({ overviewPage }) => {
      await overviewPage.uploadImage(imagePath);

      await test.step('tree view', async () => {
        await overviewPage.uploadImage(imagePath);

        const nodeData = flattenTree(claim);

        expect(await overviewPage.nodeLocator().count()).toBe(nodeData.length);

        for (const { data, locator } of nodeData) {
          const node = overviewPage.nodeLocator(locator);

          await expect(node).toContainText(data.fileName);
          await expect(node).toHaveCAIBadge(data.badge);
        }
      });

      await test.step('about panel', async () => {
        await aboutHelper(overviewPage.page).expectToMatchClaim(claim);
      });
    });
  }
});

// @TODO: can these assertions be shared with inspect?
test.describe('invalid file format', () => {
  test('should show an invalid filetype error', async ({ overviewPage }) => {
    await overviewPage.goto('source=foobydoobydoo');

    await expect(overviewPage.rightColumn()).toContainText(
      'Chosen file type isn’t supported',
    );
  });
});

test.describe('about panel navigation', () => {
  test('panel updates when the active node is changed', async ({
    overviewPage,
  }) => {
    await overviewPage.uploadImage('CAICAI.jpg');

    // Must bypass actionability checks - otherwise playwright will not attempt to click "through" the SVG elements
    await overviewPage.nodeLocator('0.0').click({ force: true });

    await aboutHelper(overviewPage.page).expectToMatchClaim(
      CAICAI.claim.ingredients[0],
    );
  });

  // @TODO: Ingredients with errors are not yet handled correctly
  test.skip('panel should display the correct data when an ingredient with error is selected', async ({
    overviewPage,
  }) => {
    await overviewPage.uploadImage('CAIECA.jpg');

    await overviewPage.nodeLocator('0.1').click({ force: true });

    await aboutHelper(overviewPage.page).expectToMatchClaim(
      CAIECA.claim.ingredients[1],
    );
  });
});
