import { sveltekit } from '@sveltejs/kit/vite';
import fs from 'fs';
import path from 'path';
import { replaceCodePlugin } from 'vite-plugin-replace';
import svelteSvg from './etc/rollup/plugins/svelte-svg';

function getSupportedLocales() {
  const dictPath = path.resolve(__dirname, './locales/');
  return fs.readdirSync(dictPath).map((file) => path.basename(file, '.json'));
}

/** @type {import('vite').UserConfig} */
const config = {
  server: {
    fs: {
      allow: ['assets', 'locales'],
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      // Added since error names were being mangled, resulting in incorrect error handling (CAI-3792)
      keep_classnames: true,
    },
  },
  plugins: [
    sveltekit(),
    svelteSvg(),
    replaceCodePlugin({
      replacements: [
        {
          from: '__SUPPORTED_LOCALES__', // type defined in global.d.ts
          to: JSON.stringify(getSupportedLocales()),
        },
      ],
    }),
  ],
};

export default config;
