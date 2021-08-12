import { initI18n } from './lib/i18n';
import HMR from '@roxi/routify/hmr';
import App from './App.svelte';
import '@spectrum-web-components/theme/theme-lightest.js';
import '@spectrum-web-components/theme/scale-large.js';
import '@spectrum-web-components/theme/sp-theme.js';

initI18n();
const app = HMR(App, { target: document.body }, 'app-root');

export default app;
