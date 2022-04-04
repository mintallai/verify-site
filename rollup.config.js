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

import { createRollupConfigs } from './rollup/base.config.js';
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
      }),
    ];
  },
  swWrapper: (worker) => worker,
};

const configs = createRollupConfigs(config);

export default configs;
