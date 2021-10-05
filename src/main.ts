import { initI18n } from './lib/i18n';
import HMR from '@roxi/routify/hmr';
import App from './App.svelte';
import '@spectrum-web-components/theme/theme-lightest.js';
import '@spectrum-web-components/theme/scale-large.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/action-menu/sp-action-menu.js';
import '@spectrum-web-components/circle-loader/sp-circle-loader.js';
import '@spectrum-web-components/coachmark/sp-coachmark.js';
import '@spectrum-web-components/icon';
import '@spectrum-web-components/menu/sp-menu.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/picker/sp-picker.js';
import '@spectrum-web-components/tabs/sp-tabs.js';
import '@spectrum-web-components/tabs/sp-tab.js';

initI18n();

const app = HMR(App, { target: document.body }, 'app-root');

export default app;
