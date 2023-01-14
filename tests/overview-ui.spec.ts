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

import { expect } from '@playwright/test';
import { allImages } from './descriptors';
import CAICAI from './descriptors/images/CAICAI';
import { aboutHelper } from './helpers/about';
import { test } from './test';
import { testID } from './utils/selectors';
import { flattenTree } from './utils/tree';

test.describe('overview - UI rendering', () => {
  for (const { description, imagePath, claim, overviewDisabled } of allImages) {
    test(`${description} [${imagePath}]`, async ({ overviewPage }) => {
      await overviewPage.uploadImage(imagePath);
      if (overviewDisabled) {
        let isDisabled = await overviewPage.page
          .locator(testID('overview.btn'))
          .getAttribute('disabled');
        await expect(isDisabled).not.toBeNull();
      } else {
        await overviewPage.page.locator(testID('overview.btn')).click();
        await overviewPage.page.waitForSelector(testID('tree-view'));
        await test.step('tree view', async () => {
          await overviewPage.uploadImage(imagePath);

          const nodeData = flattenTree(claim);

          expect(await overviewPage.nodeLocator().count()).toBe(
            nodeData.length,
          );

          for (const { data, locator } of nodeData) {
            const node = overviewPage.nodeLocator(locator);

            await expect(node).toContainText(data.fileName);
            await expect(node).toHaveCAIBadge(data.badge);
          }
        });
        if (claim.data.claimStatus != 'none') {
          await test.step('about panel', async () => {
            await aboutHelper(overviewPage.page).expectToMatchClaim(claim);
          });
        }
      }
    });
  }
});

// @TODO: can these assertions be shared with inspect?
test.describe('invalid file format', () => {
  test('should show an invalid filetype error', async ({ overviewPage }) => {
    await overviewPage.goto('source=foobydoobydoo');

    await expect(overviewPage.rightColumn()).toContainText(
      "That file type isn't supported. Try again with a JPG or PNG.",
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
