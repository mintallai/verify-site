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
