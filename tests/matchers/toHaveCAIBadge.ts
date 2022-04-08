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

import { Locator, expect } from '@playwright/test';
import { BadgeType } from '../../src/lib/node';

const BADGE_TYPE_TO_SELECTOR_MAP: Partial<Record<BadgeType, string>> = {
  alert: 'cai-icon-alert',
  info: 'cai-icon-info',
  missing: 'cai-icon-missing',
};

export async function toHaveCAIBadge(received: Locator, badgeType: BadgeType) {
  for (const [currentBadgeType, selector] of Object.entries(
    BADGE_TYPE_TO_SELECTOR_MAP,
  )) {
    const badge = received.locator(selector);
    const count = await badge.count();

    if (badgeType === currentBadgeType) {
      expect(badge).toBeVisible();

      if (count === 0) {
        return {
          message: () =>
            `Expected ${received} to have badge type: ${currentBadgeType}`,
          pass: false,
        };
      }

      if (count > 1) {
        return {
          message: () =>
            `Expected ${received} to have only one of badge type: ${currentBadgeType}`,
          pass: false,
        };
      }
    } else {
      if (count > 0) {
        return {
          message: () =>
            `Expected ${received} not to have badge type: ${currentBadgeType}`,
          pass: false,
        };
      }
    }
  }

  return {
    message: () => '',
    pass: true,
  };
}
