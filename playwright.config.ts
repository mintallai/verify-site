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
import type { PlaywrightTestConfig } from '@playwright/test';
import { toHaveCAIBadge } from './tests/matchers/toHaveCAIBadge.js';

const port = 4173;
const base = process.env.BASE_URL;
const baseURL = `${base ?? `http://localhost`}:${port}/`;

const config: PlaywrightTestConfig = {
  testDir: 'tests',
  testIgnore: '**/unit/**/*.test.ts',
  use: {
    baseURL,
    headless: true,
    viewport: { width: 1280, height: 2000 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: 'npm run build && npm run preview',
    port: port,
  },
};

expect.extend({
  toHaveCAIBadge,
});

export default config;
