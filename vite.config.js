import { replaceCodePlugin } from 'vite-plugin-replace';
import { sveltekit } from '@sveltejs/kit/vite';
import svelteSvg from './etc/rollup/plugins/svelte-svg';
import path from 'path';
import fs from 'fs';

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
