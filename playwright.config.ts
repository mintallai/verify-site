import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  testDir: 'tests',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5000',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
};
export default config;
