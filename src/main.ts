// ADOBE CONFIDENTIAL
// Copyright 2020 Adobe
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

import { initI18n } from './lib/i18n';
import { getConfig } from './lib/config';
import HMR from '@roxi/routify/hmr';
import App from './App.svelte';
import '@spectrum-web-components/action-menu/sp-action-menu.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/coachmark/sp-coachmark.js';
import '@spectrum-web-components/icon';
import '@spectrum-web-components/icons/sp-icons-medium.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/menu/sp-menu.js';
import '@spectrum-web-components/picker/sp-picker.js';
import '@spectrum-web-components/tabs/sp-tab.js';
import '@spectrum-web-components/tabs/sp-tabs.js';
import '@spectrum-web-components/theme/scale-large.js';
import '@spectrum-web-components/theme/scale-medium.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/theme-lightest.js';
import '@spectrum-web-components/overlay/overlay-trigger.js';
import '@spectrum-web-components/dialog/sp-dialog-wrapper.js';
// TODO: Update this with newrelic typescript defs
declare global {
  interface Window {
    newrelic: any;
  }
}

getConfig().then((config) => {
  window.newrelic?.setCustomAttribute('env', config.env);
});

initI18n();

const app = HMR(App, { target: document.body }, 'app-root');

export default app;
