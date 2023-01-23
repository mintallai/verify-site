import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import childProcess from 'child_process';

const gitRevision = childProcess
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim();

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
      fallback: null,
      precompress: false,
      strict: true,
    }),
    version: { name: gitRevision },
  },
};

export default config;
