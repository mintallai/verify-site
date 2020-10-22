import HMR from '@sveltech/routify/hmr';
import App from './App.svelte';
import '@spectrum-web-components/theme/theme-lightest.js';
import '@spectrum-web-components/theme/scale-large.js';
import '@spectrum-web-components/theme/sp-theme.js';

const app = HMR(App, { target: document.body }, 'app-root');

export default app;
