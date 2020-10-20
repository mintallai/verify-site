import childProcess from 'child_process';
import svelte from 'rollup-plugin-svelte-hot';
import Hmr from 'rollup-plugin-hot';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import del from 'del';
import { spassr } from 'spassr';
import { typescript as embeddedTypescript } from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

const year = new Date().getFullYear();
const banner = `
/*************************************************************************
 * Copyright ${year} Adobe. All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/
`;

const isNollup = !!process.env.NOLLUP;

function typeCheck() {
  return {
    writeBundle() {
      childProcess.spawn('svelte-check', {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });
    },
  };
}

export function createRollupConfigs(config) {
  const { production, serve, distDir } = config;
  const useDynamicImports =
    process.env.BUNDLING === 'dynamic' || isNollup || !!production;

  del.sync(distDir + '/**'); // clear previous builds

  if (serve && !isNollup)
    spassr({
      serveSpa: true, // serve app
      serveSsr: !isNollup, // Nollup doesn't need SSR
      silent: isNollup, // Nollup needs Spassr internally
    });

  // Combine configs as needed
  return [
    !isNollup && baseConfig(config, { dynamicImports: false }),
    useDynamicImports && baseConfig(config, { dynamicImports: true }),
  ].filter(Boolean);
}

/**
 * Base config extended by dynamicConfig and baseConfig
 */
function baseConfig(config, ctx) {
  const { dynamicImports } = ctx;
  const {
    staticDir,
    distDir,
    production,
    buildDir,
    svelteWrapper,
    rollupWrapper,
  } = config;

  const outputConfig = !!dynamicImports
    ? { format: 'esm', dir: buildDir }
    : { format: 'iife', file: `${buildDir}/bundle.js` };

  const _svelteConfig = {
    dev: !production, // run-time checks
    // Extract component CSS — better performance
    css: (css) => css.write(`${buildDir}/bundle.css`),
    hot: isNollup,
  };

  const svelteConfig = svelteWrapper(_svelteConfig, ctx) || _svelteConfig;

  const _rollupConfig = {
    inlineDynamicImports: !dynamicImports,
    preserveEntrySignatures: false,
    input: `src/main.ts`,
    output: {
      name: 'verify_site',
      sourcemap: !production,
      banner,
      ...outputConfig,
    },
    plugins: [
      copy({
        targets: [
          { src: [`${staticDir}/*`, '!*/(__index.html)'], dest: distDir },
          {
            src: [`${staticDir}/__index.html`],
            dest: distDir,
            rename: '__app.html',
            transform,
          },
        ],
        copyOnce: true,
        flatten: false,
      }),
      typeCheck(),
      svelte(svelteConfig),

      // resolve matching modules from current working directory
      resolve({
        browser: true,
        extensions: ['.svelte', '.ts', '.js'],
        dedupe: (importee) => !!importee.match(/svelte(\/|$)/),
      }),
      replace({
        'process.env.NODE_ENV': production ? '"production"' : '"development"',
      }),
      embeddedTypescript({ sourceMap: !production }),
      typescript({
        sourceMap: !production,
      }),
      commonjs(),

      production &&
        terser({
          output: {
            comments: function (node, comment) {
              var text = comment.value;
              var type = comment.type;
              if (type == 'comment2') {
                // multiline comment
                return /Adobe|@preserve|@license|@cc_on/i.test(text);
              }
            },
          },
        }), // minify
      !production && isNollup && Hmr({ inMemory: true, public: staticDir }), // refresh only updated code
      !production && !isNollup && livereload(distDir), // refresh entire window when code is updated
    ],
    watch: {
      clearScreen: false,
      buildDelay: 100,
    },
  };

  const rollupConfig = rollupWrapper(_rollupConfig, ctx) || _rollupConfig;

  return rollupConfig;

  function transform(contents) {
    const scriptTag =
      typeof config.scriptTag != 'undefined'
        ? config.scriptTag
        : '<script type="module" defer src="/build/main.js"></script>';
    const bundleTag = '<script defer src="/build/bundle.js"></script>';
    return contents
      .toString()
      .replace('__SCRIPT__', dynamicImports ? scriptTag : bundleTag);
  }
}
