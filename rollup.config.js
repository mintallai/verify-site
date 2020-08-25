import { createRollupConfigs } from './scripts/base.config.js';
import autoPreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

export const config = {
  staticDir: 'static',
  distDir: 'dist',
  buildDir: `dist/build`,
  serve: !production,
  production,
  rollupWrapper: (rollup) => rollup,
  svelteWrapper: (svelte) => {
    svelte.preprocess = [
      autoPreprocess({
        postcss: true,
        typescript: true,
        defaults: { style: 'postcss', script: 'typescript' },
      }),
    ];
  },
  swWrapper: (worker) => worker,
};

const configs = createRollupConfigs(config);

export default configs;
