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
import { test } from './test';
import { allImages } from './descriptors';
import { flattenTree } from './utils/tree';
import { aboutHelper } from './helpers/about';

import CAICAI from './descriptors/images/CAICAI';
import CAIECA from './descriptors/images/CAIECA';

test.describe('inspect - UI rendering', () => {
  for (const { description, imagePath, claim } of allImages) {
    test(`${description} [${imagePath}]`, async ({ inspectPage }) => {
      await inspectPage.uploadImage(imagePath);

      await test.step('hierarchy view', async () => {
        const nodeData = flattenTree(claim);

        expect(await inspectPage.nodeLocator().count()).toBe(nodeData.length);

        for (const { data, locator } of nodeData) {
          const node = inspectPage.nodeLocator(locator);

          await expect(node).toContainText(data.fileName);
          await expect(node).toHaveCAIBadge(data.badge);
        }
      });

      await test.step('about panel', async () => {
        if (claim.data.claimStatus === 'none') {
          const rightColumn = await inspectPage.rightColumn();
          await expect(rightColumn).toContainText(
            'No content credentials for this asset',
          );
          await expect(rightColumn).toContainText(
            'This asset doesn’t have a content record attached.',
          );
          return;
        }

        await aboutHelper(inspectPage.page).expectToMatchClaim(claim);
      });
    });
  }
});

// @TODO: can these assertions be shared with overview?
test.describe('invalid file format', () => {
  test('should show an invalid filetype error', async ({ inspectPage }) => {
    await inspectPage.goto('source=foobydoobydoo');

    await expect(inspectPage.rightColumn()).toContainText(
      'Chosen file type isn’t supported',
    );
  });
});

test.describe('about panel navigation', () => {
  test('panel updates when the active node is changed', async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage('CAICAI.jpg');

    await inspectPage.nodeLocator('0.0').click();

    await aboutHelper(inspectPage.page).expectToMatchClaim(
      CAICAI.claim.ingredients[0],
    );
  });

  // @TODO: Ingredients with errors are not yet handled correctly
  test.skip('panel should display the correct data when an ingredient with error is selected', async ({
    inspectPage,
  }) => {
    await inspectPage.uploadImage('CAIECA.jpg');

    await inspectPage.nodeLocator('0.1').click();

    await aboutHelper(inspectPage.page).expectToMatchClaim(
      CAIECA.claim.ingredients[1],
    );
  });
});
