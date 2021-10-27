import { PlaywrightTestConfig } from '@playwright/test';
const baseURL = process.env.BASE_URL;
const port = 8080;

const config: PlaywrightTestConfig = {
  testDir: 'tests',
  use: {
    baseURL,
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  webServer: baseURL
    ? null
    : {
        command: 'npm run test:server',
        port,
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
        env: {
          PORT: port.toString(),
        },
      },
};
export default config;
