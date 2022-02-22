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

import { PlaywrightTestConfig, expect } from '@playwright/test';
import { toHaveCAIBadge } from './tests/matchers/toHaveCAIBadge';

const baseURL = process.env.BASE_URL;
const port = 8081;

const config: PlaywrightTestConfig = {
  testDir: 'tests',
  use: {
    baseURL,
    headless: true,
    viewport: { width: 1280, height: 2000 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
    ignoreHTTPSErrors: true,
  },
  webServer: baseURL
    ? null
    : {
        command: 'npm run test:server',
        port,
        timeout: 120 * 1000,
        reuseExistingServer: true,
        env: {
          PORT: port.toString(),
        },
      },
};

expect.extend({
  toHaveCAIBadge,
});

export default config;
