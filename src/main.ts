import HMR from '@sveltech/routify/hmr';
import App from './App.svelte';

const app = HMR(App, { target: document.body }, 'app-root');

export default app;
