import { expect, Page } from '@playwright/test';
import { Locator } from '@playwright/test';
import {
  NestedTestClaimDescriptor,
  TestClaimDescriptor,
} from '../descriptors/types';
import { testID } from '../utils/selectors';

const ABOUT_SELECTOR = testID('about');

export function aboutHelper(root: Locator | Page) {
  const panelLocator = root.locator(ABOUT_SELECTOR);

  const panel = {
    fileName: panelLocator.locator(testID('about.file-name')),
    signedBy: panelLocator.locator(testID('about.signed-by')),
    signedOn: panelLocator.locator(testID('about.signed-on')),
    producedWith: panelLocator.locator(testID('about.produced-with')),
    producedBy: panelLocator.locator(testID('about.produced-by')),
    originalCreation: panelLocator.locator(testID('original-creation')),
    editsAndActivityItems: panelLocator.locator(
      `${testID('about.edits-and-activity')} .item-text`,
    ),
    assetItems: panelLocator.locator(`${testID('about.assets')} cai-thumbnail`),
    socialAccountLinks: panelLocator.locator(
      `${testID('about.social-accounts.link')}`,
    ),
    cryptoAddresses: panelLocator.locator(`${testID('about.crypto-address')}`),
  };

  return {
    async expectToMatchClaim({ data, ingredients }: NestedTestClaimDescriptor) {
      // file name section
      await expect(panel.fileName).toContainText(data.fileName);
      await expect(panel.fileName).toHaveCAIBadge(data.badge);

      // error displays
      if (data.claimStatus === 'error') {
        await expect(panelLocator).toContainText(
          'These content credentials are unavailable',
        );
        return;
      }

      if (data.claimStatus === 'otgp') {
        await expect(panelLocator).toContainText(
          'This file was edited without content credentials.',
        );
        return;
      }

      // signed by section
      if (data.signedBy) {
        await expect(panel.signedBy).toContainText(data.signedBy);
      } else {
        await expect(panel.signedBy).toHaveCount(0);
      }

      // signed on section
      if (data.signedOn) {
        await expect(panel.signedOn).toContainText(data.signedOn);
      } else {
        await expect(panel.signedOn).toHaveCount(0);
      }

      // produced by section
      if (data.producedBy) {
        await expect(panel.producedBy).toContainText(data.producedBy);
      } else {
        await expect(panel.producedBy).toHaveCount(0);
      }

      // produced with section
      if (data.producedWith) {
        await expect(panel.producedWith).toContainText(data.producedWith);

        // beta string
        if (data.isBeta) {
          await expect(panel.producedWith).toContainText(
            'Content Credentials (Beta)',
          );
        } else {
          await expect(panel.producedWith).not.toContainText(
            'Content Credentials (Beta)',
          );
        }
      } else {
        await expect(panel.producedWith).toHaveCount(0);
      }

      if (data.isOriginalCreation) {
        await expect(panel.originalCreation).toContainText(
          `This photo was first produced in ${data.producedWith}.`,
        );
      } else {
        await expect(panel.originalCreation).toHaveCount(0);
      }

      // edits & activity
      if (data.editsAndActivity) {
        await expect(panel.editsAndActivityItems).toHaveCount(
          data.editsAndActivity.length,
        );

        let editItemIdx = 0;
        for (const editItem of data.editsAndActivity) {
          const item = panel.editsAndActivityItems.nth(editItemIdx);

          await expect(item).toContainText(editItem.label);
          await expect(item).toContainText(editItem.name);

          editItemIdx++;
        }
      } else {
        await expect(panel.editsAndActivityItems).toHaveCount(0);
      }

      // assets
      if (ingredients) {
        await expect(panel.assetItems).toHaveCount(ingredients.length);

        let ingredientIdx = 0;
        for (const ingredient of ingredients) {
          const asset = panel.assetItems.nth(ingredientIdx);
          await expect(asset).toHaveCAIBadge(ingredient.data.badge);

          ingredientIdx++;
        }
      } else {
        await expect(panel.assetItems).toHaveCount(0);
      }

      // social accounts
      if (data.socialMedia) {
        await expect(panel.socialAccountLinks).toHaveCount(
          data.socialMedia.length,
        );

        let socialAccountsIdx = 0;
        for (const socialAccount of data.socialMedia) {
          const account = panel.socialAccountLinks.nth(socialAccountsIdx);

          await expect(account).toContainText(socialAccount.username);
          await expect(account).toHaveAttribute('href', socialAccount.url);

          socialAccountsIdx++;
        }
      } else {
        await expect(panel.socialAccountLinks).toHaveCount(0);
      }

      // crypto addresses
      if (data.cryptoAddress) {
        await expect(panel.cryptoAddresses).toHaveCount(
          data.cryptoAddress.length,
        );

        let cryptoAddressIdx = 0;
        for (const cryptoAddress of data.cryptoAddress) {
          const address = panel.cryptoAddresses.nth(cryptoAddressIdx);

          await expect(address).toContainText(cryptoAddress.address);

          cryptoAddressIdx;
        }
      }
    },
    panel,
  };
}
